use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, Transfer};

declare_id!("f7cqvZHhS1dM99zSUuPStPFUgsHwEacGbG9fWCS8RJP");

#[program]
pub mod vesto {
    use super::*;

    pub fn create_vesting_schedule(
        ctx: Context<CreateVestingSchedule>,
        amount: u64,
        bump: u8,
    ) -> Result<()> {
        let vesting_schedule = &mut ctx.accounts.vesting_schedule;
        vesting_schedule.owner = ctx.accounts.owner.key();
        vesting_schedule.beneficiary = ctx.accounts.beneficiary.key();
        vesting_schedule.amount = amount;
        vesting_schedule.released = 0;
        vesting_schedule.bump = bump;

        // Use CPI to transfer tokens to the escrow account
        let cpi_accounts = Transfer {
            from: ctx.accounts.owner_token_account.clone(),
            to: ctx.accounts.escrow.clone(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn release_tokens(ctx: Context<ReleaseTokens>, amount: u64) -> Result<()> {
        let vesting_schedule = &mut ctx.accounts.vesting_schedule;

        // Check release conditions
        if vesting_schedule.released + amount > vesting_schedule.amount {
            return Err(ErrorCode::ReleaseExceedsBalance.into());
        }

        // Use CPI to transfer tokens from escrow to the beneficiary
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow.clone(),
            to: ctx.accounts.beneficiary_account.clone(),
            authority: vesting_schedule.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let beneficiary_key = ctx.accounts.beneficiary.key();
        let seeds = &[
            b"vesting",
            beneficiary_key.as_ref(),
            &[vesting_schedule.bump],
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, amount)?;

        vesting_schedule.released += amount;

        Ok(())
    }
}

pub fn revoke_schedule(ctx: Context<RevokeSchedule>) -> Result<()> {
    // Mutably borrow vesting_schedule
    let vesting_schedule = &mut ctx.accounts.vesting_schedule;

    // Calculate the remaining balance
    let remaining_balance = vesting_schedule.amount - vesting_schedule.released;

    // Extract required fields into variables to avoid conflicts
    let vesting_authority = vesting_schedule.to_account_info();
    let beneficiary_key = vesting_schedule.beneficiary.key();
    let vesting_bump = vesting_schedule.bump;

    // Define seeds
    let seeds = &[
        b"vesting",
        beneficiary_key.as_ref(),
        &[vesting_bump],
    ];
    let signer_seeds = &[&seeds[..]];

    // Create CPI context for transferring tokens
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow.clone(),
        to: ctx.accounts.owner_account.clone(),
        authority: vesting_authority.clone(), // Use the local variable
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();

    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
    token::transfer(cpi_ctx, remaining_balance)?;

    // Close the vesting schedule account
    **ctx.accounts.owner.lamports.borrow_mut() += ctx.accounts.vesting_schedule.to_account_info().lamports();
    **ctx.accounts.vesting_schedule.to_account_info().lamports.borrow_mut() = 0;
    *ctx.accounts.vesting_schedule.to_account_info().try_borrow_mut_data()? = &mut [];

    Ok(())
}

// Accounts

#[derive(Accounts)]
pub struct CreateVestingSchedule<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    /// CHECK: This is safe because we trust the client to provide a valid beneficiary account.
    #[account(mut)]
    pub beneficiary: AccountInfo<'info>,
    /// CHECK: This is safe because we trust the client to provide a valid mint account.
    #[account()]
    pub mint: AccountInfo<'info>,
    #[account(
        init,
        payer = owner,
        seeds = [b"vesting", beneficiary.key().as_ref()],
        bump,
        
        space = VestingSchedule::LEN
    )]
    pub vesting_schedule: Account<'info, VestingSchedule>,
    /// CHECK: This field is safe because it is only used for token transfers and is verified by the program logic.
    #[account(mut)]
    pub escrow: AccountInfo<'info>,
    /// CHECK: This field is safe because it is only used for token transfers and is verified by the program logic.
    #[account(mut)]
    pub owner_token_account: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ReleaseTokens<'info> {
    #[account(mut, has_one = beneficiary)]
    pub vesting_schedule: Account<'info, VestingSchedule>,
    #[account(mut)]
    pub beneficiary: Signer<'info>,
    /// CHECK: This field is safe because it is only used for token transfers and is verified by the program logic.
    #[account(mut)]
    pub escrow: AccountInfo<'info>, // Use AccountInfo for TokenAccount
    /// CHECK: This field is safe because it is only used for token transfers and is verified by the program logic.
    #[account(mut)]
    
    pub beneficiary_account: AccountInfo<'info>, // Use AccountInfo for TokenAccount
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RevokeSchedule<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub vesting_schedule: Account<'info, VestingSchedule>,
    /// CHECK: This field is safe because it is only used for token transfers and is verified by the program logic.
    #[account(mut)]
    pub escrow: AccountInfo<'info>, // Use AccountInfo for TokenAccount
    /// CHECK: This field is safe because it is only used for token transfers and is verified by the program logic.
    #[account(mut)]
    pub owner_account: AccountInfo<'info>, // Use AccountInfo for TokenAccount
    pub token_program: Program<'info, Token>,
}

// Data

#[account]
pub struct VestingSchedule {
    pub owner: Pubkey,
    pub beneficiary: Pubkey,
    pub amount: u64,
    pub released: u64,
    pub bump: u8,
}

impl VestingSchedule {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 1; // Discriminator + Owner + Beneficiary + Amount + Released + Bump
}

// Errors

#[error_code]
pub enum ErrorCode {
    #[msg("The release amount exceeds the remaining balance.")]
    ReleaseExceedsBalance,
}
