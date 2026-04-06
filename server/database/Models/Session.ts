import {
  Entity,
  Column,
  Index,
  Generated,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { IEntity } from "../Base";
import { User } from "./User";

@Entity()
export class Session extends IEntity {
  @Generated() id!: number;
  @Index({ unique: true }) @Column("text") token!: string;

  @Index({ unique: true }) @Column("integer") userId!: number;
  @OneToOne(() => User, (u) => u.session, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column("datetime") expiresAt!: Date;
  @Column("datetime", { nullable: true }) revokedAt?: Date;
  @Column("text", { nullable: true }) userAgent?: string;
  @Column("text", { nullable: true }) ip?: string;
}
