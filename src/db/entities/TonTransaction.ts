import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne } from 'typeorm'
import { TargetAddress } from './TargetAddress'

@Entity()
export class TonTransaction {
  @PrimaryGeneratedColumn()
    id: number

  @ManyToOne(() => TargetAddress, (address) => address.transactions, { nullable: false })
    target_address: TargetAddress

  @Column({ unique: true })
  @Index()
    hash: string

  @Column()
    utime: Date

  @Column()
    logical_time: string

  @Column({ nullable: true, type: 'bigint' })
    income?: number

  @Column({ nullable: true, type: 'bigint' })
    expense?: number

  @Column({ type: 'jsonb' })
    body: any

  @Column({ nullable: true })
    message?: string

  @Column()
    peer_address: string

  @Column({ default: false })
    processed: boolean
}
