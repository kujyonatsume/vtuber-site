import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { IEntity } from "../Base";
import { ProviderEnum } from "#shared/Enum";
import { User } from "./User";

@Entity()
export class SocialAccount extends IEntity {
  @Index() @Column("integer") userId!: number;
  @ManyToOne(() => User, (u) => u.socialAccounts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column("text") provider!: ProviderEnum;
  @Column("text") providerUid!: string;
  @Index({ unique: true }) @Column("text") providerKey!: string;
  @Column("text", { nullable: true }) email?: string;
  @Column("text", { nullable: true }) accessToken?: string;
  @Column("text", { nullable: true }) refreshToken?: string;
  @Column("text", { nullable: true }) scope?: string;
  @Column("datetime", { nullable: true }) tokenExpiresAt?: Date;
  @Column("text", { nullable: true }) profileJson?: string;
}
