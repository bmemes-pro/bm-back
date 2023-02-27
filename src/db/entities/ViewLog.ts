import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity()
export class ViewLog {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    date: Date

  @Column()
  @Index()
    post_id: number

  @Column({ nullable: true })
    user_agent?: string

  @Column({ nullable: true })
    user_ip?: string

  @Column({ default: false })
    by_api: boolean

  @Column({ default: false })
    by_frontend: boolean

  @Column({ default: false })
    by_share: boolean

  @Column({ default: false })
    by_like: boolean

  @Column({ default: false })
    processed: boolean

  @Column({ default: false })
    is_bot_user_agent: boolean

  @Column({ default: false })
    is_sharing_user_agent: boolean
}
