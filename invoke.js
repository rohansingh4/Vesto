import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Vesto } from "../target/types/vesto";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";
import * as assert from "assert";

describe("vesting_schedule", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Vesto as Program<Vesto>;
  const owner = provider.wallet;
  let mint = null;
  let ownerTokenAccount = null;
  let beneficiaryTokenAccount = null;
  let escrow = null;
  let vestingSchedule = null;

  before(async () => {
    // Create a new SPL token mint
    mint = await createMint(provider.connection, owner.payer, owner.publicKey, null, 9);

    // Create token accounts
    ownerTokenAccount = await createAccount(provider.connection, owner.payer, mint, owner.publicKey);
    beneficiaryTokenAccount = await createAccount(provider.connection, owner.payer, mint, owner.publicKey);

    // Mint tokens to the owner's account
    await mintTo(provider.connection, owner.payer, mint, ownerTokenAccount, owner.publicKey, 1000 * 10 ** 9);
  });

  it("Creates a vesting schedule", async () => {
    const [vestingSchedulePda, vestingScheduleBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("vesting"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    escrow = await createAccount(provider.connection, owner.payer, mint, vestingSchedulePda);

    await program.methods
      .createVestingSchedule(new anchor.BN(500 * 10 ** 9), vestingScheduleBump)
      .accounts({
        owner: owner.publicKey,
        beneficiary: provider.wallet.publicKey,
        mint,
        vestingSchedule: vestingSchedulePda,
        escrow,
        ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([])
      .rpc();

    // Fetch the vesting schedule account to validate
    vestingSchedule = await program.account.vestingSchedule.fetch(vestingSchedulePda);
    assert.ok(vestingSchedule.owner.equals(owner.publicKey));
    assert.ok(vestingSchedule.beneficiary.equals(provider.wallet.publicKey));
    assert.strictEqual(vestingSchedule.amount.toNumber(), 500 * 10 ** 9);
    assert.strictEqual(vestingSchedule.released.toNumber(), 0);
  });

  it("Releases tokens to the beneficiary", async () => {
    await program.methods
      .releaseTokens(new anchor.BN(200 * 10 ** 9))
      .accounts({
        vestingSchedule: vestingSchedule.publicKey,
        beneficiary: provider.wallet.publicKey,
        escrow,
        beneficiaryAccount: beneficiaryTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([])
      .rpc();

    vestingSchedule = await program.account.vestingSchedule.fetch(vestingSchedule.publicKey);
    assert.strictEqual(vestingSchedule.released.toNumber(), 200 * 10 ** 9);

    const beneficiaryBalance = await provider.connection.getTokenAccountBalance(beneficiaryTokenAccount);
    assert.strictEqual(parseInt(beneficiaryBalance.value.amount), 200 * 10 ** 9);
  });

  it("Revokes the vesting schedule and refunds the owner", async () => {
    await program.methods
      .revokeSchedule()
      .accounts({
        owner: owner.publicKey,
        vestingSchedule: vestingSchedule.publicKey,
        escrow,
        ownerAccount: ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([])
      .rpc();

    const remainingBalance = vestingSchedule.amount.toNumber() - vestingSchedule.released.toNumber();
    const ownerBalance = await provider.connection.getTokenAccountBalance(ownerTokenAccount);

    assert.strictEqual(parseInt(ownerBalance.value.amount), remainingBalance);
  });
});