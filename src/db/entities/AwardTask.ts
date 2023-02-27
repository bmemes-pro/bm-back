import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm'
import { Post } from './Post'
import { TonTransaction } from './TonTransaction'

@Entity()
export class AwardTask {
  @PrimaryGeneratedColumn()
    id: number

  @CreateDateColumn()
    created_at: Date

  @Column({ type: 'decimal', precision: 6, scale: 2 })
    amount: number

  @Column()
    postId: number

  @ManyToOne(() => Post, (post) => post.award_tasks)
  @JoinColumn({ name: 'postId' })
    post: Post

  @Column()
    message: string

  @Column({ nullable: true })
    sent_at?: Date

  @OneToOne(() => TonTransaction, { nullable: true })
  @JoinColumn()
    ton_transaction?: TonTransaction

  @Column({ nullable: true })
    found_at?: Date
}
