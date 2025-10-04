import 'reflect-metadata'
import { BaseEntity, DataSource } from 'typeorm'
import * as models from '../database/Models'

let typeorm: DataSource

export async function initDB(): Promise<DataSource> {
    if (typeorm && typeorm.isInitialized) return typeorm

    const ds = new DataSource({
        type: 'better-sqlite3',
        database: './.data/database.db',
        synchronize: true,           // 有 migrations 再改 false
        logging: process.env.NODE_ENV !== 'production',
        entities: Object.values(models),
    })

    typeorm = await ds.initialize()
    BaseEntity.useDataSource(typeorm)

    // 讓 db.User / db.Post 使用 BaseEntity 靜態方法
    global.db = models

    return typeorm
}
