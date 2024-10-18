import { FormEvent, useState } from "react";
import { VersionedTransaction } from '@solana/web3.js'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function TxForm() {
    const [tx, setTx] = useState("");
    const [signature, setSignature] = useState("");
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const transaction = VersionedTransaction.deserialize(
            Buffer.from(tx, 'base64')
        );

        try {
            if (!publicKey) {
                throw new Error("Wallet is not Connected");
            }

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.message.recentBlockhash = blockhash;
            const sigResult = await sendTransaction(transaction, connection);

            if (sigResult) {
                setSignature(sigResult)
                console.log(`Signature: ${sigResult}`);
            }
        } catch (err) {
            console.error("Error:", err)
        }
    }

    return (
        <div className="w-full h-full flex-col flex justify-center items-center gap-y-5 ">
            <form onSubmit={onSubmit} className="w-full max-w-[600px] flex flex-col justify-center items-center gap-y-3">
                <input
                    type="text"
                    title="Transaction in base64"
                    alt="Transaction in base64"
                    required
                    placeholder='Transaction in base64'
                    onChange={(e) => setTx(e.target.value)}
                    className="w-full h-9 rounded-lg outline-none border-2 border-[#14F195] px-3"
                />
                <button className="w-full h-9 bg-[#14F195] rounded-lg text-black font-semibold">Request</button>
            </form>


            <span className="font-semibold">{signature}</span>

        </div>
    )
}