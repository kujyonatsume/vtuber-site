<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="5" lg="4">
        <VCard class="pa-8" elevation="4" rounded="xl">
          <VCardTitle class="text-h5 font-weight-bold pb-1">
            {{ mode === "login" ? "登入" : "註冊" }}
          </VCardTitle>
          <VCardSubtitle class="text-medium-emphasis pb-6">
            使用帳號密碼或第三方登入
          </VCardSubtitle>

          <VForm @submit.prevent="submit" v-model="valid" class="mb-6">
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
              class="mb-4"
              :disabled="busy"
            />

            <VRow class="mb-2" no-gutters>
              <VCol class="pr-2">
                <VBtn
                  color="black"
                  variant="flat"
                  rounded="lg"
                  block
                  :loading="busy"
                  type="submit"
                >
                  {{ mode === "login" ? "登入" : "建立帳號" }}
                </VBtn>
              </VCol>
              <VCol class="pl-2">
                <VBtn
                  color="grey-darken-1"
                  variant="outlined"
                  rounded="lg"
                  block
                  :disabled="busy"
                  @click="toggleMode"
                >
                  {{ mode === "login" ? "改為註冊" : "改為登入" }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>

          <div class="my-4 d-flex align-center">
            <div
              class="flex-grow-1"
              style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
            ></div>
            <span class="mx-2 text-caption text-medium-emphasis">或</span>
            <div
              class="flex-grow-1"
              style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
            ></div>
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
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="tsx">
const email = ref("");
const password = ref("");
const name = ref("");
const busy = ref(false);
const error = ref("");
const valid = ref(false);
const loading = ref<null | "google" | "discord">(null);
const mode = ref<"login" | "register">("login");

const r = {
  required: (v: any) => !!v || v === 0 || "必填",
  email: (v: string) => /.+@.+\..+/.test(v) || "Email 格式錯誤",
};

async function submit() {
  if (!valid.value) return;
  error.value = "";
  busy.value = true;
  try {
    if (mode.value === "login") {
      await $fetch("/api/auth/login", {
        method: "POST",
        body: { email: email.value, password: password.value },
      });
    } else {
      await $fetch("/api/auth/register", {
        method: "POST",
        body: {
          email: email.value,
          password: password.value,
          name: name.value,
        },
      });
    }
    const { next } = useRoute().params;
    await navigateTo(next as string);
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "操作失敗";
  } finally {
    busy.value = false;
  }
}

function toggleMode() {
  mode.value = mode.value === "login" ? "register" : "login";
}

async function oauthSignIn(provider: "google" | "discord") {
  error.value = "";
  loading.value = provider;
  try {
    const res = await $fetch<{ url?: string; redirectTo?: string }>(
      `/api/auth/${provider}`,
      { method: "GET" }
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
