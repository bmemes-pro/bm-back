import { AwardTask } from './AwardTask'
import { User } from './User'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ nullable: true })
    message?: string

  @Column({ type: 'jsonb', nullable: true }) // TODO nullable = false !?
    img_urls: string[]

  @Column()
    utime: Date

  @OneToMany(() => Post, post => post.parent)
    replies: Post[]

  @Column({ nullable: true })
    reply_to_post_id?: number

  @ManyToOne(() => Post, post => post.replies)
  @JoinColumn({ name: 'reply_to_post_id' })
    parent: Post

  @Column({ unique: true })
    txhash: string

  @Column({ default: 0 })
    views_count: number

  @Column({ default: 0 })
    shares_count: number

  @Column({ default: 0 })
    likes_count: number

  @Column({ default: 0 })
    replies_count: number

  @Column({ default: 0 })
    score: number

  @Column({ default: false })
    need_update_score: boolean

  @Column({ default: false })
    hidden: boolean

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    awards_amount: number

  @OneToMany(() => AwardTask, (task) => task.post)
    award_tasks: AwardTask[]

  @Column()
    user_id: number

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
    user: User
}

// future TODO add new relations models: lint to user model (address), link to transaction, link to bmp_message
