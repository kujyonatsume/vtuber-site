# vtuber-site

🌐 Language: [繁體中文](./README.md) | **English**

🎤 A VTuber event website project featuring event information, a blessing submission wall, user account features, and admin moderation tools.

## 🚀 Download and Setup

### 1. 🧰 Requirements

- Node.js `22.12.0` (see `.nvmrc`)
- bun (latest version recommended)

### 2. 📥 Clone the Repository

```bash
git clone https://github.com/kujyonatsume/vtuber-site.git
cd vtuber-site
```

### 3. 📦 Install Dependencies

```bash
bun install
```

### 4. ⚙️ Initialize Environment Variables

macOS / Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Please verify at least these variables:

- `PORT`
- `DB_PATH`
- `SESSION_SECRET`
- `OAUTH_GOOGLE_*`
- `OAUTH_DISCORD_*`

### 5. ▶️ Start Development Server

```bash
bun dev
```

## 🧪 Common Commands

```bash
# Development
bun dev

# Build
bun build

# Preview build
bun preview

# Generate static site
bun generate

# Start (via start.js)
bun start
```

## 🧱 Tech Stack

- Framework: Nuxt 4
- UI Library: Vuetify
- Language: TypeScript
- Styling: Tailwind CSS + SCSS
- I18n: `@nuxtjs/i18n`
- Package manager: bun

## 🗂️ Project Structure (Feature-Oriented)

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

## 📋 Features (By Page)

| Module | Route | Access | Description |
| --- | --- | --- | --- |
| Home | `/` | Public | Hero, countdown, and quick navigation to event/submission pages |
| Event | `/event` | Public | Event intro, timeline, and submission entry |
| Clips | `/clips` | Public | Clip card listing |
| Wishes Wall | `/wishes` | Public | Blessing content browsing (masonry cards) |
| New Submission | `/wishes/new` | Login Required | Submit text, anonymous option, media/link attachment, license agreement |
| Search | `/search` | Public | Search users/posts with pagination and tabs |
| About | `/about` | Public | Project and contact information |
| Login | `/user/login` | Public | Account login and social login entry |
| User Dashboard | `/user/account` | Login Required | Profile, password, social binding, and own posts management |
| Public Profile | `/user/:id` | Public | Public user info and post listing |
| OAuth Callback | `/auth/google` `/auth/discord` | Public (flow page) | Handles third-party login callback and redirect |
| Admin Review | `/admin/contribute` | Admin | Submission moderation (approve/reject/delete) |
| Admin Users | `/admin/users` | Admin | User list, role updates, filtering/sorting |

## 🔄 Core Flows

- Submission flow: logged-in users submit from `/wishes/new` to `POST /api/submit`, then admin reviews.
- Moderation flow: admins moderate in `/admin/contribute` with `approve/reject/delete`.
- Account flow: standard login, Google/Discord OAuth, password setup, social unlinking.
- Discovery flow: browse at `/wishes`, search at `/search`, and view public profiles at `/user/:id`.

## ✅ TODO

### 🛠️ Improvements

- [ ] Admin submission card layout: fixed-height with scrollable content or fully auto-height content

### 🧩 Not Implemented Yet

- [ ] Advanced tagging features (inspired by social platforms)

### 🌟 Potential Additions

- [ ] Auto-save submission drafts (prevent data loss on leave)
- [ ] Pre-submit preview (text/image/video/embed)
- [ ] Edit submissions before review
- [ ] Interactions (like/favorite/share)
- [ ] Comments and replies (optional login-only mode)
- [ ] Report system (inappropriate content report + admin handling)
- [ ] Notification center (review result, comment notice, system announcements)
- [ ] Tag pages and trending tags (hashtag exploration)
- [ ] Advanced search filters (category/date/status/tags)
- [ ] Follow system for creators/posters
- [ ] Batch moderation in admin panel
- [ ] Admin action logs (moderation and role-change audit)

### 🎨 Profile Page Decoration (Detailed)

- [ ] Cover section and themed background
- [ ] Avatar frame and status badges (e.g., admin, creator, event participant)
- [ ] Profile info card (nickname, bio, join date, location/timezone)
- [ ] Social links section (YouTube, X, Discord, Twitch, etc.)
- [ ] Pinned section (featured posts / representative works)
- [ ] Tabbed content area (posts, media, favorites)
- [ ] User metrics area (post count, favorites, interactions)
- [ ] Achievement badge system (milestones, event missions)
- [ ] Theme customization (colors, background, tag style)
- [ ] Better empty states and skeleton loading
- [ ] Entry/switch animations (fade, slide, hover)
- [ ] Mobile optimization (small-screen layout, touch targets)
- [ ] Accessibility improvements (keyboard support, contrast, alt text)

## 📜 License and External References

### 🧾 Project License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE).

### 💡 Modification Policy

All forms of modifications and improvements are welcome in this project. Under the Apache 2.0 terms, modified versions must clearly indicate the changes made. The original author hopes to maintain good communication with the community; if you plan major modifications or create a fork, please contact me in advance through any [social link](https://natsumes.cc/about). Thank you very much.

### 📦 Third-Party License References

- Nuxt: MIT License
  https://github.com/nuxt/nuxt
- Vue: MIT License
  https://github.com/vuejs/core
- Vuetify: MIT License
  https://github.com/vuetifyjs/vuetify
- Tailwind CSS: MIT License
  https://github.com/tailwindlabs/tailwindcss
- @nuxtjs/i18n: MIT License
  https://github.com/nuxt-modules/i18n
- @mdi/font: Apache License 2.0
  https://www.npmjs.com/package/@mdi/font

All trademarks and rights for third-party packages belong to their respective authors and owners. Please comply with each package's license terms.
