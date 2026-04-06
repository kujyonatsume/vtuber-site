import { Entity, Column, Generated, Index, OneToMany, OneToOne } from "typeorm"
import { IEntity } from "../Base"
import { RoleEnum } from "~/shared/types/Enum"
import { Post } from "./Post"
import { Session } from "./Session"
import { SocialAccount } from "./SocialAccount"

@Entity()
export class User extends IEntity {
    @Column('text')
    @Generated('uuid')
    uuid!: string

    @Index({ unique: true })
    @Column('text')
    email!: string

    @Column('text', { nullable: true })
    passwordHash?: string

    @Column('text', { default: RoleEnum.User })
    role!: RoleEnum

    @Column('text', { nullable: true }) name?: string
    @Column('text', { nullable: true }) avatar?: string

    @Column('datetime', { nullable: true }) lastLoginAt?: Date
    @Column('text', { nullable: true }) metaJson?: string

    @OneToMany(() => Post, p => p.author) posts!: Post[]
    @OneToMany(() => SocialAccount, sa => sa.user) socialAccounts!: SocialAccount[]
    @OneToOne(() => Session, s => s.user) session!: Session
}
