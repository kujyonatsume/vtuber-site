<template>
  <section class="mx-auto max-w-3xl py-10 space-y-6">
    <h1 class="text-2xl font-bold">帳號設定</h1>

    <div class="card p-6 space-y-4">
      <div class="flex items-center gap-3">
        <img
          :src="user?.avatar || '/favicon.ico'"
          class="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div class="font-semibold">{{ user?.name || user?.email }}</div>
          <div class="text-sm text-neutral-400">{{ user?.email }}</div>
        </div>
      </div>

      <VDivider class="my-2" />

      <h2 class="font-semibold">社群綁定</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="card p-4 flex items-center justify-between">
          <div>
            <div class="font-medium">Google</div>
            <div class="text-xs text-neutral-400">
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

        <div class="card p-4 flex items-center justify-between">
          <div>
            <div class="font-medium">Discord</div>
            <div class="text-xs text-neutral-400">
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
  </section>
</template>

<script setup lang="ts">
import { toast } from "vuetify-sonner";
definePageMeta({ middleware: "auth" });

const { user, refresh } = useAuth();

const linked = computed(() => user.value?.linked);

function isLinked(p: "google" | "discord") {
  return linked.value.some((x) => x === p);
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
</script>
