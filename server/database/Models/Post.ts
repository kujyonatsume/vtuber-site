import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { IEntity } from "../Base";
import { PostCategoryEnum, PostStatusEnum } from "#shared/Enum";
import { User } from "./User";

@Entity()
export class Post extends IEntity {
  @Column("boolean") isAnonymous!: boolean;
  @Column("text", { default: PostCategoryEnum.None })
  category!: PostCategoryEnum;
  @Column("text") message!: string;
  @Column("text", { nullable: true }) assetUrl?: string;
  @Column("text", { default: PostStatusEnum.Pending }) status!: PostStatusEnum;

  @Index()
  @Column("integer", { nullable: true })
  authorId?: number;

  @ManyToOne(() => User, (u) => u.posts, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "authorId" })
  author?: User;
}
