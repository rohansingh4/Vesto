const { PublicKey } = require('@solana/web3.js');

async function deriveEscrowPDA() {
  // Replace with your program ID and seed
  const programId = new PublicKey('DnohjE7epPNSbLP9S6omUXn7JFrDznC98WLb2YWEKfdc');
  const beneficiaryPubkey = new PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp'); // Replace with actual beneficiary public key

  // Derive the PDA
  const [escrowPDA, bump] = await PublicKey.findProgramAddressSync(
    [Buffer.from('vesting'), beneficiaryPubkey.toBuffer()],
    programId
  );

  console.log('Escrow PDA:,bump', escrowPDA.toString(), bump);
}

// Call the async function
deriveEscrowPDA().catch(err => {
  console.error('Error deriving escrow PDA:', err);
});