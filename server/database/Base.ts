import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
export * from 'typeorm'

export abstract class IEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment') index!: number
    @CreateDateColumn({ type: 'datetime' }) createdAt!: Date
    @UpdateDateColumn({ type: 'datetime' }) updatedAt!: Date
}
