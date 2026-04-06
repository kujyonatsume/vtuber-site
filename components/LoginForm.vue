<template>
  <VCard rounded="xl">
    <VCardTitle class="pb-1 text-h6 font-weight-bold">
      {{ mode === "login" ? "登入" : "註冊" }}
    </VCardTitle>
    <VCardSubtitle class="pb-4 text-medium-emphasis">
      使用帳號密碼或第三方登入
    </VCardSubtitle>

    <VCardText>
      <VForm v-model="valid" class="mb-4" @submit.prevent="submit">
        <VTextField
          v-if="mode === 'register'"
          v-model="name"
          label="顯示名稱"
          :rules="[r.required]"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-3"
          :disabled="busy"
        />
        <VTextField
          v-model="email"
          label="Email"
          type="email"
          :rules="[r.required, r.email]"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-3"
          :disabled="busy"
        />
        <VTextField
          v-model="password"
          label="密碼"
          type="password"
          :rules="[r.required]"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          :disabled="busy"
        />
        <VBtn
          block
          color="primary"
          class="mt-4"
          type="submit"
          :loading="busy"
          rounded="lg"
        >
          {{ mode === "login" ? "登入" : "建立帳號" }}
        </VBtn>
      </VForm>

      <div class="mb-4 text-center">
        <VBtn color="secondary" variant="text" @click="modeToggle">
          {{ mode === "login" ? "沒有帳號？建立一個" : "已有帳號？前往登入" }}
        </VBtn>
      </div>

      <div class="my-3 d-flex align-center">
        <div
          class="flex-grow-1"
          style="border-top: 1px solid rgba(255, 255, 255, 0.08)"
        />
        <span class="mx-2 text-caption text-medium-emphasis">或</span>
        <div
          class="flex-grow-1"
          style="border-top: 1px solid rgba(255, 255, 255, 0.08)"
        />
      </div>

      <div class="d-flex flex-column ga-3">
        <VBtn
          variant="outlined"
          rounded="lg"
          block
          :loading="loading === 'google'"
          @click="oauthSignIn('google')"
        >
          <template #prepend
            ><VIcon color="#4285F4">mdi-google</VIcon></template
          >
          使用 Google 繼續
        </VBtn>
        <VBtn
          variant="outlined"
          rounded="lg"
          block
          :loading="loading === 'discord'"
          @click="oauthSignIn('discord')"
        >
          <template #prepend
            ><VIcon color="#5865F2">mdi-discord</VIcon></template
          >
          使用 Discord 繼續
        </VBtn>
      </div>

      <VAlert
        v-if="error"
        type="error"
        variant="tonal"
        class="mt-4"
        density="comfortable"
        rounded="lg"
      >
        {{ error }}
      </VAlert>
    </VCardText>

    <VCardActions v-if="showClose" class="justify-end">
      <VBtn variant="text" @click="emit('cancel')">關閉</VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showClose?: boolean;
  }>(),
  {
    showClose: false,
  }
);
const { showClose } = toRefs(props);

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const { refresh } = useAuth();
const route = useRoute();
const loginRedirect = useState<string | null>("login:redirect", () => null);

const email = ref("");
const password = ref("");
const name = ref("");
const busy = ref(false);
const valid = ref(false);
const loading = ref<null | "google" | "discord">(null);
const error = ref("");
const mode = ref<"login" | "register">("login");

const r = {
  required: (v: any) => !!v || v === 0 || "必填",
  email: (v: string) => /.+@.+\..+/.test(v) || "Email 格式錯誤",
};

function resolveSafePath(raw?: unknown) {
  if (typeof raw !== "string") return null;

  const value = raw.trim();
  if (!value) return null;

  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) return decoded;
  } catch {
    if (value.startsWith("/") && !value.startsWith("//")) return value;
  }

  return null;
}

function resolveLoginTarget() {
  const rawNext = Array.isArray(route.query.next)
    ? route.query.next[0]
    : route.query.next;

  return resolveSafePath(rawNext) || resolveSafePath(loginRedirect.value);
}

async function submit() {
  if (!valid.value) return;
  error.value = "";
  busy.value = true;
  try {
    if (mode.value === "login") {
      await $fetch("/api/user/login", {
        method: "POST",
        body: { email: email.value, password: password.value },
      });
    } else {
      await $fetch("/api/user/register", {
        method: "POST",
        body: {
          email: email.value,
          password: password.value,
          name: name.value,
        },
      });
    }

    await refresh();
    toast.success(mode.value === "login" ? "登入成功" : "註冊成功");

    emit("success");

    const target = resolveLoginTarget();
    loginRedirect.value = null;

    if (target && target !== route.fullPath) {
      await navigateTo(target);
      return;
    }
    if (route.path === "/user/login") {
      await navigateTo("/");
    }
  } catch (e: any) {
    error.value =
      e?.data?.statusMessage || e?.data?.message || e?.message || "操作失敗";
  } finally {
    busy.value = false;
  }
}

function modeToggle() {
  mode.value = mode.value === "login" ? "register" : "login";
}

async function oauthSignIn(provider: "google" | "discord") {
  error.value = "";
  loading.value = provider;
  try {
    const target = resolveLoginTarget() || resolveSafePath(route.fullPath);
    const res = await $fetch<{ url?: string; redirectTo?: string }>(
      `/api/auth/${provider}`,
      {
        method: "GET",
        query: target ? { next: encodeURIComponent(target) } : undefined,
      }
    );
    const url = res?.url || res?.redirectTo;
    if (url) return navigateTo(url, { external: true });
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/api/auth/${provider}`;
    document.body.appendChild(form);
    form.submit();
  } finally {
    loading.value = null;
  }
}
</script>
