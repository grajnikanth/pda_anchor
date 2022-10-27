import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PdaAnchor } from "../target/types/pda_anchor";
import {PublicKey} from '@solana/web3.js';
import {expect} from 'chai';

describe("pda_anchor", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PdaAnchor as Program<PdaAnchor>;

    // obtain the PDA with seeds = "user-stats", wallet publickey and ProgramId of 
    // the pdaAnchor program
    const [userStatsPDA, _] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        provider.wallet.publicKey.toBuffer()
      ],
      program.programId
    );

  it("Create PDA to store user_stats", async () => {
    
    // send a transaction to create a new user_stats account PDA for the publickey
    // associated with provider.wallet.publicKey
    // system_program program ID was not sent as an account for this method call???
    await program.methods
          .createUserStats("brian")
          .accounts({
            user: provider.wallet.publicKey,
            userStats: userStatsPDA, 
          })
          .rpc();

    const userStatsBlkchain = await program.account.userStats.fetch(userStatsPDA);

    console.log("userStatsBlkchain account in test -1 is ");
    console.log(userStatsBlkchain);
    expect(userStatsBlkchain.name).to.equal("brian");
  });

  it("Changes PDA data field", async () => {
    
    // send a transaction to create a new user_stats account PDA for the publickey
    // associated with provider.wallet.publicKey
    await program.methods
          .changeUserName("Tom")
          .accounts({
            user: provider.wallet.publicKey,
            userStats: userStatsPDA, 
          })
          .rpc();

    const userStatsBlkchain = await program.account.userStats.fetch(userStatsPDA);

    console.log("userStatsBlkchain updated account in 2nd test is ");
    console.log(userStatsBlkchain);
    expect(userStatsBlkchain.name).to.equal("Tom");
  });



});
