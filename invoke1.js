// const anchor = require('@project-serum/anchor');
// const { Keypair, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
// const fs = require('fs');

// // Set up the connection to the testnet and wallet
// const connection = new anchor.web3.Connection('https://rpc.testnet.soo.network/rpc', 'confirmed');
// const wallet = new anchor.Wallet(Keypair.fromSecretKey(Uint8Array.from([
//   123, 89, 57, 148, 75, 113, 197, 72, 224, 125, 118, 72, 158, 29, 81, 62, 49, 201, 249, 126, 226, 205, 128, 83, 132, 50, 199, 137, 80, 139, 118, 54, 63, 10, 56, 99, 197, 40, 246, 23, 173, 72, 43, 93, 152, 149, 106, 21, 97, 30, 72, 37, 16, 104, 145, 135, 54, 132, 163, 194, 153, 159, 126, 169,
// ])));

// const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
// anchor.setProvider(provider);

// // Load the IDL file directly
// const idlPath = './target/idl/vesto.json'; // Path to your IDL file
// const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8')); // Read and parse the IDL JSON file

// // Set up Program ID and other required addresses
// const programId = new anchor.web3.PublicKey('3WNE2z7h6o5u5wpurRAskpRYeHbRx8v4S1TcYZvdk2Lc'); // Replace with actual Program ID
// const mint = new anchor.web3.PublicKey('DnohjE7epPNSbLP9S6omUXn7JFrDznC98WLb2YWEKfdc'); // Replace with actual Mint PublicKey
// const escrowAddress = new anchor.web3.PublicKey('E9dhW76SWfK7VZFFvvGtdY8dXrWyDT1dNE5dWAQi9HtW'); // Replace with actual Escrow Address
// const beneficiary = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp'); // Replace with actual beneficiary address
// const ownerTokenAccount = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp'); // Replace with actual owner's token account
// const vestingScheduleAddress = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp'); // Replace with actual vesting schedule address
// const TOKEN_PROGRAM_ID=new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// // Create program instance
// const program = new anchor.Program(idl, programId, provider);

// // Get Unix timestamps for start_date, cliff_date, and end_date
// const start_date = new Date('2024-12-01T00:00:00Z').getTime() / 1000; // Example: Dec 1, 2024
// const cliff_date = new Date('2025-01-01T00:00:00Z').getTime() / 1000; // Example: Jan 1, 2025
// const end_date = new Date('2026-01-01T00:00:00Z').getTime() / 1000; // Example: Jan 1, 2026


// // Call the function to initialize the vesting program
// initializeVesting();
// console.log("Initialized");
// // Call the function to create the vesting schedule
// //  createVestingSchedule();


// async function createVestingSchedule() {
//     try {
//         // Log the owner public key to verify it is being passed correctly
//         console.log('Wallet Public Key (Owner):', wallet.publicKey.toString());

//         // Validate all necessary inputs
//         if (!escrowAddress || !beneficiary || !mint || !ownerTokenAccount || !vestingScheduleAddress) {
//             throw new Error('One or more addresses are undefined.');
//         }

//         // Fetch the required accounts
//         const accounts = {
//             owner: wallet.publicKey, // Set the owner as the wallet's public key
//             beneficiary,
//             mint,
//             escrow: escrowAddress,
//             ownerTokenAccount,
//             vestingSchedule: vestingScheduleAddress,
//             tokenProgram: TOKEN_PROGRAM_ID,
//             systemProgram: SystemProgram.programId, 
//             rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//         };


//         // Create the transaction to invoke the vesting schedule creation
//         const transaction = new Transaction().add(
//             program.methods.createVestingSchedule(
//                 new anchor.BN(1000), // Replace with the actual amount as BN
//                 new anchor.BN(252),  // Replace with the actual bump seed as BN
//                 new anchor.BN(start_date),
//                 new anchor.BN(end_date),
//                 new anchor.BN(cliff_date)
//             )
//             .accounts({
//                 owner: wallet.publicKey,
//                 beneficiary,
//                 mint,
//                 escrow: escrowAddress,
//                 ownerTokenAccount,
//                 vestingSchedule: vestingScheduleAddress,
//                 tokenProgram: TOKEN_PROGRAM_ID,
//                 systemProgram: programId,
//                 rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//             })
//             .signers([wallet.payer])
//             .transaction()
//         );

//         console.log("Transaction: ", transaction);

//         // Sign and send the transaction
//         console.log('Sending transaction...');
//         const signature = await provider.sendAndConfirm(transaction, [wallet.payer]);

//         console.log('Transaction confirmed with signature:', signature);
//     } catch (error) {
//         console.error('Error creating vesting schedule:', error.message);
//         if (error.logs) {
//             console.log('Transaction logs:', error.logs);
//         }
//     }
// }
// async function initializeVesting() {
//     try {
//         // Log the owner public key to verify it is being passed correctly
//         console.log('Wallet Public Key (Owner):', wallet.publicKey.toString());

//         // Ensure required addresses are defined
//         if (!escrowAddress || !ownerTokenAccount) {
//             throw new Error('One or more addresses are undefined.');
//         }

//         // Define the accounts needed for the initialize function
//         const accounts = {
//             owner: wallet.publicKey, // Set the owner as the wallet's public key
//             systemProgram: anchor.web3.SystemProgram.programId, // Required for creating accounts
//             // Other program-specific accounts can be added here (e.g., escrowAddress)
//         };

//         // Create the transaction to invoke the initialize function
//         const transaction = new anchor.web3.Transaction().add(
//             // Replace this with the actual method and accounts for your program
//             program.methods.initialize()  // Example method, replace with your program's initialize function
//             .accounts({
//                 owner: wallet.publicKey,
//                 escrow: escrowAddress, // Include other required addresses
//                 systemProgram: anchor.web3.SystemProgram.programId,
//                 // Other necessary accounts for your vesting program
//             })
//             .instruction()  // Ensure this is the correct method to create an instruction
//         );

//         // Try fetching blockhash, fallback if the method isn't supported
//         let blockhash;
//         try {
//             // Try fetching using the supported method for Soon blockchain (change if different)
//             const { blockhash: latestBlockhash } = await connection.getLatestBlockhash();
//             blockhash = latestBlockhash;
//         } catch (err) {
//             console.error("Error fetching blockhash using getLatestBlockhash:", err.message);
//             // Fallback to alternative method if available
//             try {
//                 const alternativeBlockhash = await connection.getBlockhash(); // Change to actual method if different
//                 blockhash = alternativeBlockhash;
//             } catch (fallbackErr) {
//                 throw new Error("Failed to fetch blockhash using both methods.");
//             }
//         }

//         // Set the recent blockhash for the transaction
//         transaction.recentBlockhash = blockhash;
//         transaction.feePayer = wallet.publicKey; // Set the fee payer (the wallet paying for the transaction)

//         console.log("Transaction: ", transaction);

//         // Sign and send the transaction
//         console.log('Sending transaction...');
//         const signature = await provider.sendAndConfirm(transaction, [wallet.payer]);

//         console.log('Transaction confirmed with signature:', signature);
//     } catch (error) {
//         console.error('Error initializing vesting:', error.message);
//         if (error.logs) {
//             console.log('Transaction logs:', error.logs);
//         }
//     }
// }



// const anchor = require('@project-serum/anchor'); // Import anchor library

// // Initialize connection to the Soon blockchain testnet
// const connection = new anchor.web3.Connection('https://rpc.testnet.soo.network/rpc', 'confirmed');

// // Replace these with actual wallet, escrow, and token account addresses
// const wallet = {
//     publicKey: new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp'), // Replace with your wallet public key
//     payer: new anchor.web3.Keypair() // Use your keypair to sign the transaction
// };
// const escrowAddress = new anchor.web3.PublicKey('E9dhW76SWfK7VZFFvvGtdY8dXrWyDT1dNE5dWAQi9HtW'); // Replace with the actual escrow address
// const ownerTokenAccount = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp'); // Replace with the token account address

// // Define the programId for your vesting contract (replace with your program's public key)
// const programId = new anchor.web3.PublicKey('3WNE2z7h6o5u5wpurRAskpRYeHbRx8v4S1TcYZvdk2Lc'); // Replace with your actual program ID

// async function initializeVesting() {
//     try {
//         // Log the owner public key to verify it is being passed correctly
//         console.log('Wallet Public Key (Owner):', wallet.publicKey.toString());

//         // Ensure required addresses are defined
//         if (!escrowAddress || !ownerTokenAccount) {
//             throw new Error('One or more addresses are undefined.');
//         }

//         // Define the accounts needed for the initialize function
//         const accounts = {
//             owner: wallet.publicKey, // Set the owner as the wallet's public key
//             systemProgram: anchor.web3.SystemProgram.programId, // Required for creating accounts
//             // Other program-specific accounts can be added here (e.g., escrowAddress)
//         };

//         // Create the transaction to invoke the initialize function
//         const transaction = new anchor.web3.Transaction().add(
//             new anchor.web3.TransactionInstruction({
//                 keys: [
//                     { pubkey: wallet.publicKey, isSigner: true, isWritable: true },  // Owner
//                     { pubkey: escrowAddress, isSigner: false, isWritable: true },  // Escrow address
//                     { pubkey: anchor.web3.SystemProgram.programId, isSigner: false, isWritable: false }
//                     // Include other required accounts here
//                 ],
//                 programId: programId,  // Set the programId for your contract
//                 data: Buffer.from([]), // Replace with the data to be sent to your program
//             })
//         );

//         // Try fetching blockhash, fallback if the method isn't supported
//         let blockhash;
//         try {
//             // Try fetching using the supported method for Soon blockchain (change if different)
//             const { blockhash: latestBlockhash } = await connection.getLatestBlockhash();
//             blockhash = latestBlockhash;
//         } catch (err) {
//             console.error("Error fetching blockhash using getLatestBlockhash:", err.message);
//             // Fallback to alternative method if available
//             try {
//                 const alternativeBlockhash = await connection.getBlockhash(); // Change to actual method if different
//                 blockhash = alternativeBlockhash;
//             } catch (fallbackErr) {
//                 throw new Error("Failed to fetch blockhash using both methods.");
//             }
//         }

//         // Set the recent blockhash for the transaction
//         transaction.recentBlockhash = blockhash;
//         transaction.feePayer = wallet.publicKey; // Set the fee payer (the wallet paying for the transaction)

//         console.log("Transaction: ", transaction);

//         // Sign and send the transaction
//         console.log('Sending transaction...');
//         const signature = await connection.sendAndConfirmTransaction(transaction, [wallet.payer]);

//         console.log('Transaction confirmed with signature:', signature);
//     } catch (error) {
//         console.error('Error initializing vesting:', error.message);
//         if (error.logs) {
//             console.log('Transaction logs:', error.logs);
//         }
//     }
// }

// // Call the function to initialize vesting
// initializeVesting();


// const anchor = require('@project-serum/anchor'); // Import anchor library

// // Initialize connection to the Soon blockchain testnet
// const connection = new anchor.web3.Connection('https://rpc.testnet.soo.network/rpc', 'confirmed');

// // Create the wallet using the secret key from Uint8Array
// const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(Uint8Array.from([
//     123, 89, 57, 148, 75, 113, 197, 72, 224, 125, 118, 72, 158, 29, 81, 62, 49, 201, 249, 126, 226, 205, 128, 83, 132, 50, 199, 137, 80, 139, 118, 54, 63, 10, 56, 99, 197, 40, 246, 23, 173, 72, 43, 93, 152, 149, 106, 21, 97, 30, 72, 37, 16, 104, 145, 135, 54, 132, 163, 194, 153, 159, 126, 169
// ])));

// // Replace these with actual escrow and token account addresses
// const escrowAddress = new anchor.web3.PublicKey('E9dhW76SWfK7VZFFvvGtdY8dXrWyDT1dNE5dWAQi9HtW'); // Replace with the actual escrow address
// const ownerTokenAccount = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp'); // Replace with the token account address

// // Define the programId for your vesting contract (replace with your program's public key)
// const programId = new anchor.web3.PublicKey('3WNE2z7h6o5u5wpurRAskpRYeHbRx8v4S1TcYZvdk2Lc'); // Replace with your actual program ID

// // Create the provider using the correct format
// const provider = new anchor.AnchorProvider(connection, wallet, {
//     commitment: 'confirmed', // Set the commitment level (confirmed or processed)
//     preflightCommitment: 'processed', // Set preflight commitment (optional)
// });

// anchor.setProvider(provider); // Set the provider globally in the Anchor framework

// async function initializeVesting() {
//     try {
//         // Log the owner public key to verify it is being passed correctly
//         console.log('Wallet Public Key (Owner):', wallet.publicKey.toString());

//         // Ensure required addresses are defined
//         if (!escrowAddress || !ownerTokenAccount) {
//             throw new Error('One or more addresses are undefined.');
//         }

//         // Define the accounts needed for the initialize function
//         const accounts = {
//             owner: wallet.publicKey, // Set the owner as the wallet's public key
//             systemProgram: anchor.web3.SystemProgram.programId, // Required for creating accounts
//             escrow: escrowAddress, // Add the escrow address here
//             tokenAccount: ownerTokenAccount, // Token account to fund vesting
//             // Other program-specific accounts can be added here (e.g., escrowAddress)
//         };

//         // Define instruction data (usually an 8-byte identifier)
//         const instructionData = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]); // Replace with actual instruction data (8 bytes)

//         // Create the transaction to invoke the initialize function
//         const transaction = new anchor.web3.Transaction().add(
//             new anchor.web3.TransactionInstruction({
//                 keys: [
//                     { pubkey: wallet.publicKey, isSigner: true, isWritable: true },  // Owner
//                     { pubkey: escrowAddress, isSigner: false, isWritable: true },  // Escrow address
//                     { pubkey: ownerTokenAccount, isSigner: false, isWritable: true },  // Token account
//                     { pubkey: anchor.web3.SystemProgram.programId, isSigner: false, isWritable: false }
//                     // Include other required accounts here
//                 ],
//                 programId: programId,  // Set the programId for your contract
//                 data: instructionData, // Pass the 8-byte instruction identifier here
//             })
//         );

//         // Fetch the blockhash for the transaction
//         const { blockhash } = await connection.getLatestBlockhash();

//         // Set the recent blockhash for the transaction
//         transaction.recentBlockhash = blockhash;
//         transaction.feePayer = wallet.publicKey; // Set the fee payer (the wallet paying for the transaction)

//         console.log("Transaction: ", transaction);

//         // Sign and send the transaction using the provider
//         console.log('Sending transaction...');
//         const signature = await provider.sendAndConfirm(transaction, [wallet.payer]);

//         console.log('Transaction confirmed with signature:', signature);
//     } catch (error) {
//         console.error('Error initializing vesting:', error.message);
//         if (error.logs) {
//             console.log('Transaction logs:', error.logs);
//         }
//     }
// }

// // Call the function to initialize vesting
// initializeVesting();



// const anchor = require('@project-serum/anchor'); // Import anchor library
// const fs = require('fs');

// // Initialize connection to the Soon blockchain testnet
// const connection = new anchor.web3.Connection('https://rpc.testnet.soo.network/rpc', 'confirmed');

// const idlPath = './target/idl/vesto.json'; // Path to your IDL file
// const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8')); // Read and parse the IDL JSON file

// // Create the wallet using the secret key from Uint8Array
// const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(Uint8Array.from([
//     123, 89, 57, 148, 75, 113, 197, 72, 224, 125, 118, 72, 158, 29, 81, 62, 49, 201, 249, 126, 226, 205, 128, 83, 132, 50, 199, 137, 80, 139, 118, 54, 63, 10, 56, 99, 197, 40, 246, 23, 173, 72, 43, 93, 152, 149, 106, 21, 97, 30, 72, 37, 16, 104, 145, 135, 54, 132, 163, 194, 153, 159, 126, 169
// ])));

// // Define the programId for your vesting contract (replace with your program's public key)
// const programId = new anchor.web3.PublicKey('3WNE2z7h6o5u5wpurRAskpRYeHbRx8v4S1TcYZvdk2Lc'); // Replace with your actual program ID

// // Create the provider using the correct format
// const provider = new anchor.AnchorProvider(connection, wallet, {
//     commitment: 'confirmed', // Set the commitment level (confirmed or processed)
//     preflightCommitment: 'processed', // Set preflight commitment (optional)
// });

// anchor.setProvider(provider); // Set the provider globally in the Anchor framework

// async function initializeVesting() {
//     try {
//         // Log the owner public key to verify it is being passed correctly
//         console.log('Wallet Public Key (Owner):', wallet.publicKey.toString());

//         // Define the accounts needed for the initialize function
//         const accounts = {
//             owner: wallet.publicKey, // Set the owner as the wallet's public key
//             systemProgram: anchor.web3.SystemProgram.programId, // Required for creating accounts
//         };

//         // Call the initialize function from your contract
//         const program = new anchor.Program(idl, programId, provider); // Create an instance of your program
//         await program.rpc.initialize({
//             accounts: accounts,
//         });

//         console.log('Vesting contract initialized successfully');
//     } catch (error) {
//         console.error('Error initializing vesting:', error.message);
//         if (error.logs) {
//             console.log('Transaction logs:', error.logs);
//         }
//     }
// }

// // Call the function to initialize vesting
// initializeVesting();

// const anchor = require('@project-serum/anchor'); // Import anchor library
// const fs = require('fs');
// // Initialize connection to the Soon blockchain testnet
// const connection = new anchor.web3.Connection('https://rpc.testnet.soo.network/rpc', 'confirmed');
// const idlPath = './target/idl/vesto.json'; // Path to your IDL file
// const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8')); // Read and parse the IDL JSON file

// // Create the wallet using the secret key from Uint8Array
// const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(Uint8Array.from([
//     123, 89, 57, 148, 75, 113, 197, 72, 224, 125, 118, 72, 158, 29, 81, 62, 49, 201, 249, 126, 226, 205, 128, 83, 132, 50, 199, 137, 80, 139, 118, 54, 63, 10, 56, 99, 197, 40, 246, 23, 173, 72, 43, 93, 152, 149, 106, 21, 97, 30, 72, 37, 16, 104, 145, 135, 54, 132, 163, 194, 153, 159, 126, 169
// ])));

// // Define the programId for your vesting contract
// const programId = new anchor.web3.PublicKey('3WNE2z7h6o5u5wpurRAskpRYeHbRx8v4S1TcYZvdk2Lc');

// // Addresses for mint, escrow, and owner token account (as per your example)
// const mint = new anchor.web3.PublicKey('DnohjE7epPNSbLP9S6omUXn7JFrDznC98WLb2YWEKfdc');
// const escrowAddress = new anchor.web3.PublicKey('E9dhW76SWfK7VZFFvvGtdY8dXrWyDT1dNE5dWAQi9HtW');
// const beneficiary = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp');
// const ownerTokenAccount = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp');

// // Create the provider using the correct format
// const provider = new anchor.AnchorProvider(connection, wallet, {
//     commitment: 'confirmed',
//     preflightCommitment: 'processed',
// });

// anchor.setProvider(provider); // Set the provider globally in the Anchor framework

// async function createVestingSchedule() {
//     try {
//         // Define the parameters for the vesting schedule
//         const amount = 100; // The amount to vest
//         const bump = 255; // The bump for the account creation
//         const startDate = Math.floor(Date.now() / 1000); // Use current Unix timestamp for start date
//         const endDate = startDate + 31536000; // Set end date as 1 year from start date (in seconds)
//         const cliffDate = startDate + 2592000; // Set cliff date to 30 days from start date

//         console.log("wallet: ", wallet.publicKey);

//         // Ensure all public keys are instances of PublicKey
//         const owner = wallet.publicKey;  // PublicKey instance for the wallet
//         const beneficiary = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp');
//         const mint = new anchor.web3.PublicKey('DnohjE7epPNSbLP9S6omUXn7JFrDznC98WLb2YWEKfdc');
//         const escrow = new anchor.web3.PublicKey('E9dhW76SWfK7VZFFvvGtdY8dXrWyDT1dNE5dWAQi9HtW');
//         const ownerTokenAccount = new anchor.web3.PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp');
//         const tokenProgram = new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
//         const systemProgram = anchor.web3.SystemProgram.programId;
//         const rent = anchor.web3.SYSVAR_RENT_PUBKEY;

//         // Generate a new vesting schedule account
//         const vestingSchedule = anchor.web3.Keypair.generate().publicKey;

//         // Define the accounts needed for the transaction
//         const accounts = {
//             owner: owner,
//             beneficiary: beneficiary,
//             mint: mint,
//             vestingSchedule: vestingSchedule, // Ensure it's a PublicKey instance
//             escrow: escrow,
//             ownerTokenAccount: ownerTokenAccount,
//             tokenProgram: tokenProgram,
//             systemProgram: systemProgram,
//             rent: rent,
//         };

//         console.log("Accounts: ", accounts);

//         // Initialize the program with the IDL, program ID, and provider
//         const program = new anchor.Program(idl, programId, provider);

//         // Call the create_vesting_schedule function from the backend contract
//         const transaction = await program.rpc.createVestingSchedule(amount, bump, startDate, endDate, cliffDate, {
//             accounts: accounts,  // Pass accounts here
//         });

//         console.log("Transaction signature:", transaction);
//     } catch (error) {
//         console.error("Error creating vesting schedule:", error.message);
//     }
// }

// // Call the function to create the vesting schedule
// createVestingSchedule();



// const anchor = require('@project-serum/anchor');
// const fs = require('fs');
// const { PublicKey, Keypair, SystemProgram } = anchor.web3;

// // Initialize connection to the Soon blockchain testnet
// const connection = new anchor.web3.Connection('https://rpc.testnet.soo.network/rpc', 'confirmed');
// const idlPath = './target/idl/vesto.json'; // Path to your IDL file
// const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8')); // Read and parse the IDL JSON file

// // Create the wallet using the secret key from Uint8Array
// const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(Uint8Array.from([
//     123, 89, 57, 148, 75, 113, 197, 72, 224, 125, 118, 72, 158, 29, 81, 62, 49, 201, 249, 126, 226, 205, 128, 83, 132, 50, 199, 137, 80, 139, 118, 54, 63, 10, 56, 99, 197, 40, 246, 23, 173, 72, 43, 93, 152, 149, 106, 21, 97, 30, 72, 37, 16, 104, 145, 135, 54, 132, 163, 194, 153, 159, 126, 169
// ])));

// // Define the programId for your vesting contract
// const programId = new PublicKey('3WNE2z7h6o5u5wpurRAskpRYeHbRx8v4S1TcYZvdk2Lc');

// // Addresses for mint, escrow, and owner token account (as per your example)
// const mint = new PublicKey('DnohjE7epPNSbLP9S6omUXn7JFrDznC98WLb2YWEKfdc');
// const escrowAddress = new PublicKey('E9dhW76SWfK7VZFFvvGtdY8dXrWyDT1dNE5dWAQi9HtW');
// const beneficiary = new PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp');
// const ownerTokenAccount = new PublicKey('5F5iyvuEA7KeRwseuy8vA1miaNSajLMiyp2c9NeRgGGp');

// // Create the provider using the correct format
// const provider = new anchor.AnchorProvider(connection, wallet, {
//     commitment: 'confirmed',
//     preflightCommitment: 'processed',
// });

// anchor.setProvider(provider); // Set the provider globally in the Anchor framework

// async function createVestingSchedule() {
//     try {
//         // Define the parameters for the vesting schedule
//         const amount = new anchor.BN(100); // Use BN for u64 type
//         const bump = 255; // The bump for the account creation
//         const startDate = new anchor.BN(Math.floor(Date.now() / 1000)); // Use current Unix timestamp for start date (i64)
//         const endDate = startDate.add(new anchor.BN(31536000)); // Set end date as 1 year from start date (i64)
//         const cliffDate = startDate.add(new anchor.BN(2592000)); // Set cliff date to 30 days from start date (i64)

//         console.log("wallet: ", wallet.publicKey.toString());

//         // Generate a new vesting schedule account
//         const vestingSchedule = Keypair.generate().publicKey;

//         // Define the accounts needed for the transaction
//         const accounts = {
//             owner: wallet.publicKey, // PublicKey instance for owner
//             beneficiary: beneficiary,
//             mint: mint,
//             vestingSchedule: vestingSchedule, // PublicKey instance
//             escrow: escrowAddress,
//             ownerTokenAccount: ownerTokenAccount,
//             tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
//             systemProgram: SystemProgram.programId,
//             rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//         };

//         // Initialize the program with the IDL, program ID, and provider
//         const program = new anchor.Program(idl, programId, provider);

//         // Call the create_vesting_schedule function from the backend contract
//         const transaction = await program.rpc.createVestingSchedule(amount, bump, startDate, endDate, cliffDate, {
//             accounts: accounts,  // Pass accounts here
//         });

//         console.log("Transaction signature:", transaction);
//     } catch (error) {
//         console.error("Error creating vesting schedule:", error.message);
//     }
// }

// // Call the function to create the vesting schedule
// createVestingSchedule();


const { BN } = require('@coral-xyz/anchor');
const { Program, web3 } = require('@coral-xyz/anchor');
const { SystemProgram ,Keypair} = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');
const {  AnchorProvider } = require('@coral-xyz/anchor');
const { PublicKey } = require('@solana/web3.js');
const fs = require('fs');
// Load the IDL file directly
const idlPath = './target/idl/vesto.json'; // Path to your IDL file
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8')); // Read and parse the IDL JSON file


const programId = new PublicKey('3WNE2z7h6o5u5wpurRAskpRYeHbRx8v4S1TcYZvdk2Lc');
const connection = new anchor.web3.Connection('https://rpc.testnet.soo.network/rpc', 'confirmed');
const wallet = new anchor.Wallet(Keypair.fromSecretKey(Uint8Array.from([
  123, 89, 57, 148, 75, 113, 197, 72, 224, 125, 118, 72, 158, 29, 81, 62, 49, 201, 249, 126, 226, 205, 128, 83, 132, 50, 199, 137, 80, 139, 118, 54, 63, 10, 56, 99, 197, 40, 246, 23, 173, 72, 43, 93, 152, 149, 106, 21, 97, 30, 72, 37, 16, 104, 145, 135, 54, 132, 163, 194, 153, 159, 126, 169,
])));


// Assuming you have the relevant context, such as the provider and program ID
const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });


const program = new Program(idl, programId, provider);
console.log("program: ", program);

// Define your accounts
const accounts = {
  owner: signer.publicKey,
  beneficiary: beneficiary.publicKey,
  mint: mintPublicKey,
  vestingSchedule: vestingSchedulePda,
  escrow: escrowAccount,
  ownerTokenAccount: ownerTokenAccount,
  tokenProgram: tokenProgramId,
  systemProgram: SystemProgram.programId,
  rent: rentSysvar,
};

// Vesting parameters
const amount = new BN(0.005 * 1e9);  // 0.005 tokens (converted to smallest unit for a 9-decimal token)
const bump = 253;  // Example bump value
const startDate = Math.floor(Date.now() / 1000);  // Current timestamp
const endDate = startDate + 3600 * 24 * 30;  // Example end date: 30 days later
const cliffDate = startDate + 3600 * 24 * 7;  // Example cliff date: 7 days later

// Create Vesting Schedule
try {
  const transaction =  program.rpc.createVestingSchedule(
    amount,   // Pass amount as BN (BigNumber)
    bump,     // Bump
    startDate,
    endDate,
    cliffDate,
    {
      accounts: accounts,  // Pass relevant accounts
    }
  );

  console.log('Transaction successful: ', transaction);
} catch (err) {
  console.error('Error creating vesting schedule: ', err);
}
