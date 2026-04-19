<template>
  <VCard rounded="xl">
    <VCardTitle class="pb-1 text-h6 font-weight-bold">
      {{ mode === "login" ? t("loginForm.titleLogin") : t("loginForm.titleRegister") }}
    </VCardTitle>
    <VCardSubtitle class="pb-4 text-medium-emphasis">
      {{ t("loginForm.subtitle") }}
    </VCardSubtitle>

    <VCardText>
      <VForm v-model="valid" class="mb-4" @submit.prevent="submit">
        <VTextField
          v-if="mode === 'register'"
          v-model="name"
          :label="t('loginForm.fields.name')"
          :rules="[r.required]"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-3"
          :disabled="busy"
        />
        <VTextField
          v-model="email"
          :label="t('loginForm.fields.email')"
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
          :label="t('loginForm.fields.password')"
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
          {{ mode === "login" ? t("loginForm.submitLogin") : t("loginForm.submitRegister") }}
        </VBtn>
      </VForm>

      <div class="mb-4 text-center">
        <VBtn color="secondary" variant="text" @click="modeToggle">
          {{ mode === "login" ? t("loginForm.toggleToRegister") : t("loginForm.toggleToLogin") }}
        </VBtn>
      </div>

      <div class="d-flex flex-column space-y-3 gap-3">
        <VBtn
          variant="outlined"
          rounded="lg"
          block
          :loading="loading === 'google'"
          @click="oauthSignIn('google')"
        >
          <template #prepend>
            <VIcon icon="mdi-google" color="#4285F4"/>
          </template>
          {{ t("loginForm.oauth.google") }}
        </VBtn>
        <VBtn
          variant="outlined"
          rounded="lg"
          block
          :loading="loading === 'discord'"
          @click="oauthSignIn('discord')"
        >
          <template #prepend>
            <VIcon icon="mdi-discord" color="#5865F2" />
          </template>
          {{ t("loginForm.oauth.discord") }}
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
      <VBtn variant="text" @click="emit('cancel')">{{ t("loginForm.close") }}</VBtn>
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

const { t } = useI18n();
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
  required: (v: unknown) => !!v || v === 0 || t("loginForm.validation.required"),
  email: (v: string) => /.+@.+\..+/.test(v) || t("loginForm.validation.email"),
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
    toast.success(
      mode.value === "login"
        ? t("loginForm.toast.loginSuccess")
        : t("loginForm.toast.registerSuccess"),
    );

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
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.message ||
      t("loginForm.toast.actionFailed");
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
