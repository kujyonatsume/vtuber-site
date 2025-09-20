//server/api/public/schedule.get.ts
export default defineEventHandler(() => {
    return [
        { id: 's1', title: '合作實況', date: '10/05', time: '20:00', platform: 'YouTube', desc: '與 XX 聯動合作' },
        { id: 's2', title: '技術直播', date: '10/07', time: '21:00', platform: 'Twitch', desc: 'Nuxt + Three.js 小實作' }
    ]
})
