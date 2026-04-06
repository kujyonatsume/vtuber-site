export enum ProviderEnum {
  Credentials = "credentials",
  Google = "google",
  Discord = "discord",
}

export enum RoleEnum {
  Owner = "owner",
  Admin = "admin",
  Member = "member",
  User = "user",
}

export class RoleFlag {
  static readonly enum = RoleEnum;
  static readonly owner = new RoleFlag(0b111);
  static readonly admin = new RoleFlag(0b011);
  static readonly member = new RoleFlag(0b001);
  static readonly user = new RoleFlag(0b000);
  constructor(public readonly value: number) {}
  has(role: RoleEnum): boolean {
    const required = RoleFlag[role];
    return (this.value & required.value) === required.value;
  }
}

export enum PostStatusEnum {
  Pending = "pending",
  Approve = "approve",
  Reject = "reject"
}

export enum PostCategoryEnum {
  None = "none",
  Image = "image",
  Video = "video",
  Embed = "embed",
  Audio = "audio",
  Link = "link",
}
