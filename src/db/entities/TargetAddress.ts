import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { TonTransaction } from './TonTransaction'

@Entity()
export class TargetAddress {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    address: string

  @Column({ default: false })
    is_main: boolean

  @Column({ default: false })
    initial_loaded: boolean

  @OneToMany(() => TonTransaction, (transaction) => transaction.target_address)
    transactions: TonTransaction[]
}
