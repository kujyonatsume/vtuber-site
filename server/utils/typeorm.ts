import 'reflect-metadata'
import { BaseEntity, DataSource } from 'typeorm'
import * as models from '../database/Models'

type GlobalWithORM = typeof globalThis & {
    $typeorm?: DataSource
    db?: typeof models
}
const g = globalThis as GlobalWithORM

export async function initDB(): Promise<DataSource> {
    if (g.$typeorm && g.$typeorm.isInitialized) return g.$typeorm

    const ds = new DataSource({
        type: 'better-sqlite3',
        database: './.data/database.db',
        synchronize: true,           // 有 migrations 再改 false
        logging: process.env.NODE_ENV !== 'production',
        entities: Object.values(models),
    })

    g.$typeorm = await ds.initialize()
    BaseEntity.useDataSource(g.$typeorm)

    // 讓 db.User / db.Post 使用 BaseEntity 靜態方法
    g.db = models

    return g.$typeorm
}
