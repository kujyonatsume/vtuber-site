# vtuber-site

VTuber 活動網站專案，提供活動資訊、投稿祝福牆、使用者帳號功能與後台審核管理。

## 專案下載與初始化

### 1. 環境需求

- Node.js `22.12.0`（見 `.nvmrc`）
- bun（建議最新版）

### 2. 下載專案

```bash
git clone https://github.com/kujyonatsume/vtuber-site.git
cd vtuber-site
```

### 3. 安裝套件

```bash
bun install
```

### 4. 初始化環境變數

macOS / Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

請至少確認以下變數：

- `PORT`
- `DB_PATH`
- `SESSION_SECRET`
- `OAUTH_GOOGLE_*`
- `OAUTH_DISCORD_*`

### 5. 啟動開發模式

```bash
bun dev
```

## 常用指令

```bash
# 開發模式
bun dev

# 建置
bun build

# 預覽建置結果
bun preview

# 產生靜態站
bun generate

# 啟動（依 start.js）
bun start
```

## 技術棧

- Framework: Nuxt 4
- UI Library: Vuetify
- Language: TypeScript
- Styling: Tailwind CSS + SCSS
- I18n: `@nuxtjs/i18n`
- Package manager: bun

## 專案結構（功能導向）

```text
app/pages
├─ index.vue
├─ event.vue
├─ clips.vue
├─ search.vue
├─ about.vue
├─ wishes
│  ├─ index.vue
│  └─ new.vue
├─ user
│  ├─ login.vue
│  ├─ account.vue
│  └─ [id].vue
├─ auth
│  ├─ google.vue
│  └─ discord.vue
└─ admin
   ├─ contribute.vue
   └─ users.vue

server/api
├─ submit.post.ts
├─ public
│  ├─ list.get.ts
│  ├─ search.get.ts
│  └─ user/[id].get.ts
├─ auth
│  ├─ me.get.ts
│  ├─ google.ts
│  ├─ discord.ts
│  └─ unlink/[provider].post.ts
├─ user
│  ├─ login.post.ts
│  ├─ logout.post.ts
│  ├─ profile.post.ts
│  ├─ password.post.ts
│  ├─ posts.get.ts
│  └─ withdraw.post.ts
└─ admin
   ├─ posts.get.ts
   ├─ moderate.post.ts
   ├─ posts/delete.post.ts
   ├─ users.get.ts
   └─ users/role.post.ts
```

## 功能表（依頁面）

| 功能模組 | 路由 | 權限 | 功能說明 |
| --- | --- | --- | --- |
| 首頁 | `/` | 公開 | 活動主視覺、倒數、導流到投稿與活動頁 |
| 活動資訊 | `/event` | 公開 | 活動介紹、流程時間軸、投稿入口 |
| 剪輯展示 | `/clips` | 公開 | 剪輯卡片展示 |
| 投稿牆 | `/wishes` | 公開 | 祝福內容瀏覽（瀑布流卡片） |
| 新增投稿 | `/wishes/new` | 需登入 | 發文、匿名、附件或連結、授權同意 |
| 全站搜尋 | `/search` | 公開 | 搜尋使用者與投稿、分頁與切換 Tabs |
| 關於頁 | `/about` | 公開 | 專案與聯絡資訊展示 |
| 登入頁 | `/user/login` | 公開 | 帳號登入與社群登入入口 |
| 個人後台 | `/user/account` | 需登入 | 個人資料、密碼、社群綁定、我的投稿管理 |
| 使用者公開頁 | `/user/:id` | 公開 | 指定使用者公開資訊與投稿列表 |
| OAuth 回呼 | `/auth/google` `/auth/discord` | 公開（流程頁） | 處理第三方登入回呼並導向 |
| 投稿審核後台 | `/admin/contribute` | 管理員 | 投稿審核（核准/退回/刪除） |
| 使用者管理後台 | `/admin/users` | 管理員 | 使用者清單、角色調整、篩選排序 |

## 核心流程摘要

- 投稿流程：使用者登入後於 `/wishes/new` 提交內容，送到 `POST /api/submit`，由後台審核。
- 審核流程：管理員於 `/admin/contribute` 針對投稿進行 `approve/reject/delete`。
- 帳號流程：支援一般登入、Google/Discord OAuth、密碼設定、社群綁定解除。
- 探索流程：`/wishes` 瀏覽投稿、`/search` 搜尋使用者與內容、`/user/:id` 查看公開頁。

## TODO

### 需修改功能

- [ ] 後台投稿頁面資訊卡排版 : 高度統一，內文捲動或高度自動適應內文

### 未實作功能

- [ ] 更多標籤功能（參考各社群軟體）

### 可新增功能（建議）

- [ ] 投稿草稿自動儲存（離開頁面不遺失）
- [ ] 投稿送出前預覽（文字、圖片、影片、嵌入連結）
- [ ] 投稿編輯功能（審核前可自行修改）
- [ ] 投稿互動功能（按讚、收藏、分享）
- [ ] 留言與回覆功能（可選擇僅登入用戶可留言）
- [ ] 檢舉功能（不當內容回報 + 後台處理狀態）
- [ ] 通知中心（審核結果、留言通知、系統公告）
- [ ] 標籤頁與熱門標籤排行（Hashtag 探索）
- [ ] 搜尋進階篩選（依分類、日期、狀態、標籤）
- [ ] 個人頁追蹤功能（追蹤創作者/投稿者）
- [ ] 管理後台批次審核（多選核准/退回/刪除）
- [ ] 管理後台操作紀錄（審核與角色異動稽核）

### 個人頁面裝飾（詳細拆分）

- [ ] 個人頁封面區（Cover）與主題背景樣式
- [ ] 頭像框與狀態徽章（例如：管理員、創作者、活動參與者）
- [ ] 個人簡介卡片（暱稱、簡介、加入時間、所在地/時區）
- [ ] 社群連結區塊（YouTube、X、Discord、Twitch 等）
- [ ] 置頂內容區（精選投稿 / 代表作品）
- [ ] 分頁式內容區（投稿、媒體、收藏）
- [ ] 個人數據區（投稿數、被收藏數、互動數）
- [ ] 個人成就徽章系統（里程碑、活動任務）
- [ ] 個人頁主題自訂（配色、背景、標籤風格）
- [ ] 空狀態與骨架載入（Skeleton）視覺優化
- [ ] 卡片進場與切換動畫（淡入、滑入、hover）
- [ ] 行動版優化（小螢幕排版、可觸控區域）
- [ ] 無障礙優化（鍵盤可操作、對比度、替代文字）

## 授權與對外引用

### 本專案授權

本專案程式碼採用 **MIT License**，詳見 [LICENSE](./LICENSE)。

### 💡 修改與貢獻說明 (Modification Policy)

本專案歡迎各種形式的改作與優化。根據 Apache 2.0 條款，修改後的版本必須標註變更說明。原作者希望能與社群保持良好溝通，若您有意進行大幅度修改或建立分支 (Fork)，請在修改前先透過 [您的連繫方式/Email] 與我聯繫告知，萬分感謝。

### 第三方套件授權引用

- Nuxt：MIT License
  https://github.com/nuxt/nuxt
- Vue：MIT License
  https://github.com/vuejs/core
- Vuetify：MIT License
  https://github.com/vuetifyjs/vuetify
- Tailwind CSS：MIT License
  https://github.com/tailwindlabs/tailwindcss
- @nuxtjs/i18n：MIT License
  https://github.com/nuxt-modules/i18n
- @mdi/font：Apache License 2.0
  https://www.npmjs.com/package/@mdi/font

第三方套件之商標與權利歸其原作者或權利人所有，使用時請遵循各自授權條款。
