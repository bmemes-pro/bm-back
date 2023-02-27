/* eslint-disable @typescript-eslint/no-unused-vars */
import { TonClient, WalletContractV4, internal } from 'ton'
import { mnemonicNew, mnemonicToPrivateKey, keyPairFromSecretKey } from 'ton-crypto'
import configuration from '../config'

const PRIVATE_KEY = ''

interface TransaferInput {
  targetAddress: string
  amount: string
  message: string
}

const generateMnemonic = async (): Promise<string[]> => {
  const mnemonics = await mnemonicNew()
  console.log(mnemonics)
  return mnemonics
}

const mnemonicToPrettyKeys = async (mnemonics: string[]): Promise<void> => {
  const keyPair = await mnemonicToPrivateKey(mnemonics)

  const workchain = 0 // Usually you need a workchain 0
  const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey })

  console.log('address: ', wallet.address)
  console.log('key: ', keyPair.secretKey.toString('base64'))
}

const transfer = async (transactions: TransaferInput[]): Promise<void> => {
  const client = new TonClient({
    endpoint: `${configuration.ton.provider_api_host}/jsonRPC`,
    apiKey: configuration.ton.provider_api_key
  })

  // const keyPair = await mnemonicToPrivateKey(MNEMONICS)
  const keyPair = keyPairFromSecretKey(Buffer.from(PRIVATE_KEY, 'base64'))

  const workchain = 0 // Usually you need a workchain 0
  const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey })
  const contract = client.open(wallet)

  const balance = await contract.getBalance()
  console.log('balance', balance)

  const seqno: number = await contract.getSeqno()

  const messages = transactions.map(t => {
    const { targetAddress, amount, message } = t
    return internal({
      value: amount,
      to: targetAddress,
      body: message,
      bounce: false
    })
  })

  try {
    const transfer = await contract.sendTransfer({
      seqno,
      messages,
      secretKey: keyPair.secretKey
    })

    console.log('transfer sended')
  } catch (e) {
    console.log('error here', e)
  }
}

export default async (): Promise<void> => {
  // const mnemonics = await generateMnemonic()
  // await mnemonicToPrettyKeys(mnemonics)

  const targetAddress = ''

  await transfer([
    {
      targetAddress,
      amount: '0.011',
      message: 'test message 1'
    },
    {
      targetAddress,
      amount: '0.012',
      message: 'test message 2'
    },
    {
      targetAddress,
      amount: '0.013',
      message: 'test message 3'
    },
    {
      targetAddress,
      amount: '0.014',
      message: 'test message 4'
    }
  ])
}
