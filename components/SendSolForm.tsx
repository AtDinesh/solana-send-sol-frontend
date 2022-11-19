import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as Web3 from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'


export const SendSolForm: FC = () => {
    const [txSignature, setTxSignature] = useState('');
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const txLink = () => {
        return txSignature ? "https://explorer.solana.com/tx/" + txSignature + "?cluster=devnet" : ''
    }

    const sendSol = event => {
        if (!connection || !publicKey){
            alert("Please connect your wallet first")
            return
        }
        event.preventDefault()

        const transaction = new Web3.Transaction()

        const instruction = Web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            lamports: Web3.LAMPORTS_PER_SOL * event.target.amount.value,
            toPubkey: event.target.recipient.value,
        });
        transaction.add(instruction);
        
        sendTransaction(transaction, connection).then(sig => {
            setTxSignature(sig)
        })

        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`)
    }

    return (
        <div>
            {
                <form onSubmit={sendSol} className={styles.form}>
                    <label htmlFor="amount">Amount (in SOL) to send:</label>
                    <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                    <br />
                    <label htmlFor="recipient">Send SOL to:</label>
                    <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                    <button type="submit" className={styles.formButton}>Send</button>
                </form>
            }
            {
                txSignature ?
                    <div>
                        <p> Transaction link: </p>
                        <a href={txLink()}> txSignature </a>
                    </div> : null
            }
        </div>
    )
}