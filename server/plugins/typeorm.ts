import "reflect-metadata";
import { BaseEntity, DataSource } from "typeorm";
import * as models from "../database/Models";
import { hashPassword } from "../utils/hash";
import { RoleEnum } from "../database";

let typeorm: DataSource | null = null;

async function initDB(config: any): Promise<DataSource> {
    if (typeorm?.isInitialized) return typeorm;

    const ds = new DataSource({
        type: "better-sqlite3",
        database: config.dbPath,
        synchronize: true,
        logging: process.env.NODE_ENV !== "production",
        entities: Object.values(models),
    });

    typeorm = await ds.initialize();
    BaseEntity.useDataSource(typeorm);

    global.db = models;

    const email = config.ownerEmail;

    const exists = await models.User.findOne({ where: { email } });
    if (!exists) {
        await models.User.create({
            email,
            name: config.ownerName,
            role: RoleEnum.Owner,
            passwordHash: hashPassword(config.ownerPassword),
            lastLoginAt: new Date(),
        }).save();
    }

    return typeorm;
}

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();

    const ds = await initDB(config);

    nitroApp.hooks.hook("close", async () => {
        if (ds.isInitialized) {
            await ds.destroy();
        }
    });
});
