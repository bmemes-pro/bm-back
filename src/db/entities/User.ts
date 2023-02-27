import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Post } from './Post'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ default: new Date() })
    created_at: Date

  @Column({ nullable: true })
    nickname?: string

  @Column({ nullable: true })
    emoji_avatar?: string

  @Column({ unique: true })
    wallet_address: string

  @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    awards_amount: number

  @Column({ default: 0 })
    posts_count: number
}
