export default defineNitroPlugin(async (nitroApp) => {
    const { initDB } = await import('../utils/typeorm')
    const ds = await initDB() // 啟動時初始化一次

    // 關閉時清理
    nitroApp.hooks.hook('close', async () => {
        if (ds.isInitialized) await ds.destroy()
    })
})
