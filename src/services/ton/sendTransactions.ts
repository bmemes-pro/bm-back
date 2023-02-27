import { TonClient, WalletContractV4, internal } from 'ton'
import { keyPairFromSecretKey } from 'ton-crypto'
import configuration from '../../config'

interface TransaferInput {
  targetAddress: string
  amount: number
  message: string
}

const { ton } = configuration
const tonClient = new TonClient({
  endpoint: `${ton.provider_api_host}/jsonRPC`,
  apiKey: ton.provider_api_key
})

export default async (transactions: TransaferInput[]): Promise<void> => {
  if (ton.awards_wallet_private_key === undefined) {
    throw new Error('ton.awards_wallet_private_key undefined')
  }

  const keyPair = keyPairFromSecretKey(Buffer.from(ton.awards_wallet_private_key, 'base64'))

  const workchain = 0 // Usually you need a workchain 0
  const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey })
  const contract = tonClient.open(wallet)

  const seqno: number = await contract.getSeqno()

  const messages = transactions.map(t => {
    const { targetAddress, amount, message } = t
    return internal({
      value: amount.toString(),
      to: targetAddress,
      body: message,
      bounce: false
    })
  })

  await contract.sendTransfer({
    seqno,
    messages,
    secretKey: keyPair.secretKey
  })
}
