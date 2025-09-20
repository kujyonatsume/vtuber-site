//server/api/public/sponsors.get.ts
export default defineEventHandler(async () => {
    return [
        { id: 's1', name: 'Alice', tier: 'Gold' },
        { id: 's2', name: 'Bob', tier: 'Silver' },
        { id: 's3', name: 'Carol', tier: 'Bronze' }
    ]
})
