<template>
  <section class="max-w-3xl py-10 mx-auto space-y-6">
    <h1 class="text-2xl font-bold">帳號設定</h1>

    <div class="p-6 space-y-4 card">
      <div class="flex items-center gap-3">
        <img
          :src="user?.avatar || '/favicon.ico'"
          class="object-cover w-10 h-10 rounded-full"
        />
        <div>
          <div class="font-semibold">{{ user?.name || user?.email }}</div>
          <div class="text-sm text-neutral-900">{{ user?.email }}</div>
        </div>
      </div>

      <VDivider class="my-2" />

      <h2 class="font-semibold">基本資料</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <img
          :src="user?.avatar || '/favicon.ico'"
          class="object-cover w-16 h-16 border rounded-full border-neutral-300/70"
        />
        <div class="space-y-3">
          <VTextField
            v-model="profileName"
            label="顯示名稱"
            density="comfortable"
            hide-details
            :disabled="savingProfile"
            maxlength="40"
            counter="40"
          />
          <VFileInput
            v-model="avatarFile"
            label="頭貼（可選）"
            density="comfortable"
            hide-details
            prepend-icon="mdi-image-outline"
            accept="image/*"
            :disabled="savingProfile"
          />
          <div class="flex items-center gap-2">
            <VBtn
              color="primary"
              rounded="lg"
              :loading="savingProfile"
              @click="saveProfile"
            >
              儲存基本資料
            </VBtn>
            <span class="text-xs text-neutral-800">支援圖片，大小上限 5MB</span>
          </div>
        </div>
      </div>

      <VDivider class="my-2" />

      <h2 class="font-semibold">社群綁定</h2>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex items-center justify-between p-4 card">
          <div>
            <div class="font-medium">Google</div>
            <div class="text-xs text-neutral-900">
              {{ isLinked("google") ? "已綁定" : "未綁定" }}
            </div>
          </div>
          <div class="flex gap-2">
            <VBtn
              v-if="!isLinked('google')"
              @click="link('google')"
              rounded="lg"
              variant="flat"
              >綁定</VBtn
            >
            <VBtn
              v-else
              color="red"
              variant="tonal"
              rounded="lg"
              @click="unlink('google')"
              >解除</VBtn
            >
          </div>
        </div>

        <div class="flex items-center justify-between p-4 card">
          <div>
            <div class="font-medium">Discord</div>
            <div class="text-xs text-neutral-900">
              {{ isLinked("discord") ? "已綁定" : "未綁定" }}
            </div>
          </div>
          <div class="flex gap-2">
            <VBtn
              v-if="!isLinked('discord')"
              @click="link('discord')"
              rounded="lg"
              variant="flat"
              >綁定</VBtn
            >
            <VBtn
              v-else
              color="red"
              variant="tonal"
              rounded="lg"
              @click="unlink('discord')"
              >解除</VBtn
            >
          </div>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-4 card">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-semibold">我的貼文紀錄</h2>
        <div class="flex items-center gap-2 text-sm text-neutral-800">
          <span>共 {{ postTotal }} 筆</span>
          <VBtn
            variant="text"
            size="small"
            :loading="postsPending"
            @click="refreshPosts"
          >
            重新整理
          </VBtn>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <VSelect
          v-model="postStatus"
          :items="postStatusItems"
          label="狀態篩選"
          density="comfortable"
          hide-details
          style="max-width: 220px"
        />
      </div>

      <div class="space-y-3">
        <article
          v-for="post in myPosts"
          :key="post.id"
          class="p-4 card"
        >
          <header class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div class="text-sm text-neutral-800">
              {{ new Date(post.createdAt).toLocaleString() }}
            </div>
            <div class="flex items-center gap-2">
              <VChip size="x-small" color="primary">{{ post.category }}</VChip>
              <VChip v-if="post.isAnonymous" size="x-small" color="grey" variant="tonal">
                匿名
              </VChip>
              <VChip size="x-small" :color="statusColor(post.status)" variant="tonal">
                {{ statusText(post.status) }}
              </VChip>
            </div>
          </header>

          <div class="space-y-1">
            <p class="text-sm leading-relaxed break-words whitespace-pre-wrap text-neutral-900">
              {{
                displayMessage(post.id, post.message)
              }}
            </p>
          </div>

          <img
            v-if="post.category === PostCategoryEnum.Image"
            :src="post.assetUrl || ''"
            class="object-cover w-full mt-3 rounded-lg max-h-56"
          />
          <a
            :href="`/wishes#post-${post.id}`"
            class="inline-flex mt-3 text-sm text-primary-700 hover:underline"
          >
            查看投稿
          </a>

          <footer class="flex items-center justify-end mt-3">
            <VBtn
              v-if="post.status !== PostStatusEnum.Approve"
              size="small"
              color="red"
              variant="tonal"
              :loading="withdrawingId === post.id"
              @click="withdrawPost(post.id)"
            >
              撤回投稿
            </VBtn>
          </footer>
        </article>

        <p
          v-if="!postsPending && !myPosts?.length"
          class="p-6 text-sm text-center border border-dashed rounded-lg border-neutral-300 text-neutral-700"
        >
          目前沒有貼文紀錄
        </p>
      </div>

      <div class="flex items-center justify-center gap-2 pt-2">
        <VBtn :disabled="postPage <= 1" @click="postPage--">上一頁</VBtn>
        <span class="text-sm text-neutral-800">第 {{ postPage }} 頁 / 共 {{ postMaxPage }} 頁</span>
        <VBtn :disabled="postPage >= postMaxPage" @click="postPage++">下一頁</VBtn>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PostCategoryEnum, PostStatusEnum } from "~/shared/Enum";
definePageMeta({ middleware: "auth" });

const { user, refresh } = useAuth();
const profileName = ref("");
const avatarFile = ref<File | File[] | null>(null);
const savingProfile = ref(false);
const postStatus = ref<"all" | "pending" | "approve" | "reject">("all");
const postPage = ref(1);
const withdrawingId = ref<number | null>(null);
const expandedPostIds = ref<number[]>([]);

const linked = computed(() => user.value?.linked);
const postStatusItems = [
  { title: "全部", value: "all" },
  { title: "待審", value: "pending" },
  { title: "通過", value: "approve" },
  { title: "退回", value: "reject" },
];

const { data: postsData, pending: postsPending, refresh: refreshPosts } = await useFetch(
  "/api/user/posts",
  {
    query: computed(() => ({
      status: postStatus.value === "all" ? undefined : postStatus.value,
      page: postPage.value,
    })),
    watch: [postStatus, postPage],
  }
);

const myPosts = computed(() => postsData.value?.items);
const postTotal = computed(() => Number(postsData.value?.total || 0));
const postMaxPage = computed(() => Math.max(1, Math.ceil(postTotal.value / 10)));

watch(
  () => user.value?.name,
  (name) => {
    profileName.value = name || "";
  },
  { immediate: true }
);
watch(postStatus, () => {
  postPage.value = 1;
});

function isLinked(p: "google" | "discord") {
  return (linked.value || []).some((x) => x === p);
}

async function link(p: "google" | "discord") {
  // 取得授權網址並導轉；回來會進 /auth/{provider}，後端回 mode=linked
  const { url } = await $fetch<{ url: string }>(`/api/auth/${p}`, {
    method: "GET",
  });
  window.location.href = url;
}

async function unlink(p: "google" | "discord") {
  await $fetch(`/api/auth/unlink/${p}`, { method: "POST" });
  await refresh();
  toast.success("已解除綁定");
}

async function saveProfile() {
  const name = profileName.value.trim();
  if (!name) {
    toast.error("請輸入顯示名稱");
    return;
  }

  savingProfile.value = true;
  try {
    const file = Array.isArray(avatarFile.value)
      ? avatarFile.value[0]
      : avatarFile.value;

    const form = new FormData();
    form.append("name", name);
    if (file) form.append("avatar", file);

    await $fetch("/api/user/profile", {
      method: "POST",
      body: form,
    });

    await refresh();
    avatarFile.value = null;
    toast.success("基本資料已更新");
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || "更新失敗");
  } finally {
    savingProfile.value = false;
  }
}

function statusText(status: PostStatusEnum) {
  if (status === PostStatusEnum.Approve) return "已通過";
  if (status === PostStatusEnum.Reject) return "已退回";
  return "待審核";
}

function statusColor(status: PostStatusEnum) {
  if (status === PostStatusEnum.Approve) return "green";
  if (status === PostStatusEnum.Reject) return "red";
  return "amber";
}

function fullText(message: string) {
  const text = (message || "").trim();
  return text || "（無內文）";
}

function normalizeText(message: string) {
  return (message || "").replace(/\s+/g, " ").trim();
}

function displayMessage(id: number, message: string) {
  if (isPostExpanded(id)) return fullText(message);
  const normalized = normalizeText(message);
  if (!normalized) return "（無內文）";
  return normalized.length > 180 ? `${normalized.slice(0, 180)}...` : normalized;
}

function isPostExpanded(id: number) {
  return expandedPostIds.value.includes(id);
}

async function withdrawPost(id: number) {
  if (
    import.meta.client &&
    !window.confirm("確定要撤回這筆投稿嗎？撤回後將無法復原。")
  ) {
    return;
  }

  withdrawingId.value = id;
  try {
    await $fetch("/api/user/withdraw", {
      method: "POST",
      body: { id },
    });
    expandedPostIds.value = expandedPostIds.value.filter((x) => x !== id);
    toast.success("已撤回投稿");

    await refreshPosts();
    if (!myPosts.value?.length && postPage.value > 1) {
      postPage.value -= 1;
      await refreshPosts();
    }
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || "撤回失敗");
  } finally {
    withdrawingId.value = null;
  }
}
</script>
