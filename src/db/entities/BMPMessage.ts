import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'
import { TonTransaction } from './TonTransaction'

@Entity()
export class BMPMessage {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    action: string

  @Column({ type: 'jsonb' })
    body: any

  @Column({ default: false })
    processed: boolean

  @OneToOne(() => TonTransaction)
  @JoinColumn()
    ton_transaction: TonTransaction
}
