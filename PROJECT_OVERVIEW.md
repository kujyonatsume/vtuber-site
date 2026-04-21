# VTuber Site 專案介紹與功能表

## 專案介紹

`vtuber-site` 是一個以 VTuber 活動為核心的互動網站，提供活動資訊展示、投稿祝福牆、使用者帳號管理、社群登入與後台審核流程。  
整體架構採用 Nuxt 4 + Vuetify + TypeScript，並搭配 i18n 與 Tailwind CSS，支援中英雙語與響應式介面。

---

## 技術棧

| 項目 | 說明 |
| --- | --- |
| Framework | Nuxt 4 |
| UI | Vuetify |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS + SCSS |
| 國際化 | `@nuxtjs/i18n` |
| 套件管理 | bun |
| 主要資料流 | Nuxt Pages + Server API (`server/api`) |

---

## 目前資料夾結構（功能導向）

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

---

## 功能表（依頁面與模組）

| 功能模組 | 路由 | 權限 | 功能說明 | 對應頁面檔案 |
| --- | --- | --- | --- | --- |
| 首頁 | `/` | 公開 | 活動主視覺、倒數、快速導流到投稿與活動頁 | `app/pages/index.vue` |
| 活動資訊 | `/event` | 公開 | 活動介紹、流程時間軸、投稿入口 | `app/pages/event.vue` |
| 剪輯展示 | `/clips` | 公開 | 顯示剪輯卡片清單 | `app/pages/clips.vue` |
| 投稿牆 | `/wishes` | 公開 | 祝福內容瀏覽（瀑布流卡片） | `app/pages/wishes/index.vue` |
| 新增投稿 | `/wishes/new` | 需登入 | 發文、匿名選項、附件或外部連結、授權同意 | `app/pages/wishes/new.vue` |
| 全站搜尋 | `/search` | 公開 | 關鍵字搜尋使用者與投稿、分頁與切換 Tabs | `app/pages/search.vue` |
| 關於頁 | `/about` | 公開 | 專案與聯絡資訊展示 | `app/pages/about.vue` |
| 登入頁 | `/user/login` | 公開 | 帳號登入與社群登入入口 | `app/pages/user/login.vue` |
| 個人後台 | `/user/account` | 需登入 | 個人資料、頭像、密碼、社群綁定、我的投稿管理 | `app/pages/user/account.vue` |
| 使用者公開頁 | `/user/:id` | 公開 | 指定使用者公開資訊與投稿列表 | `app/pages/user/[id].vue` |
| OAuth 回呼 | `/auth/google` `/auth/discord` | 公開（流程頁） | 處理第三方登入回呼並導向 | `app/pages/auth/google.vue` `app/pages/auth/discord.vue` |
| 投稿審核後台 | `/admin/contribute` | 管理員 | 投稿審核（核准/退回/刪除）、篩選排序 | `app/pages/admin/contribute.vue` |
| 使用者管理後台 | `/admin/users` | 管理員 | 使用者清單、角色調整、篩選排序 | `app/pages/admin/users.vue` |

---

## 核心流程摘要

| 流程 | 說明 |
| --- | --- |
| 投稿流程 | 使用者登入後於 `/wishes/new` 提交內容，送到 `POST /api/submit`，由後台審核。 |
| 審核流程 | 管理員於 `/admin/contribute` 針對投稿進行 `approve/reject/delete`。 |
| 帳號流程 | 支援一般登入、Google/Discord OAuth、密碼設定、社群綁定解除。 |
| 探索流程 | `/wishes` 瀏覽投稿、`/search` 搜尋使用者與內容、`/user/:id` 查看個人公開頁。 |

---

## TODO

### 需修改功能

- [ ] 後台投稿頁面資訊卡排版
- [ ] 高度統一，內文捲動
- [ ] 高度自動適應內文

### 未實作功能

- [ ] 個人頁面裝飾
- [ ] 更多標籤功能（參考各社群軟體）

---

## 備註

- 本文件依目前程式中的 `app/pages` 與 `server/api` 結構整理。
- 若新增頁面或 API，建議同步更新此文件與 `README.md`。
