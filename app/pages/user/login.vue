<template>
  <section class="layout-container login-shell">
    <ClientOnly>
      <div class="login-grid">
        <div aria-hidden class="login-orb login-orb--primary" />
        <div aria-hidden class="login-orb login-orb--secondary" />

        <aside class="login-intro">
          <p class="login-chip">{{ t("userLoginPage.chip") }}</p>
          <h1 class="login-title">{{ t("userLoginPage.title") }}</h1>
          <p class="login-desc">
            {{ t("userLoginPage.description") }}
          </p>

          <ul class="login-benefits">
            <li class="login-benefit-item">
              <VIcon icon="mdi-heart-multiple-outline" size="20" class="benefit-icon" />
              <span>{{ t("userLoginPage.benefit1") }}</span>
            </li>
            <li class="login-benefit-item">
              <VIcon icon="mdi-account-star-outline" size="20" class="benefit-icon" />
              <span>{{ t("userLoginPage.benefit2") }}</span>
            </li>
            <li class="login-benefit-item">
              <VIcon icon="mdi-shield-check-outline" size="20" class="benefit-icon" />
              <span>{{ t("userLoginPage.benefit3") }}</span>
            </li>
          </ul>
        </aside>

        <div class="login-form-panel">
          <div class="w-full max-w-[460px]">
            <LoginForm />
          </div>
        </div>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { user } = useAuth();

watch(
  () => user.value?.index,
  (id) => {
    if (!id) return;
    navigateTo("/");
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}

.login-shell {
  @apply py-8 sm:py-12;
}

.login-grid {
  @apply relative grid gap-8 overflow-hidden rounded-3xl border border-primary-200/70 bg-white/75 p-4 shadow-xl backdrop-blur-sm sm:p-8 lg:grid-cols-[1fr_minmax(420px,460px)] lg:items-center lg:gap-10;
  box-shadow: 0 30px 52px -34px rgb(var(--v-theme-on-surface) / 0.38);
}

.login-intro {
  @apply relative z-10 space-y-5;
  animation: fadeUp 0.55s ease both;
}

.login-chip {
  @apply inline-flex rounded-full border border-primary-200/90 bg-primary-50 px-4 py-1 text-xs font-semibold text-primary-700;
  letter-spacing: 0.16em;
}

.login-title {
  @apply text-3xl font-black tracking-tight text-primary-900 sm:text-4xl;
}

.login-desc {
  @apply max-w-2xl text-base leading-relaxed text-neutral-800;
}

.login-benefits {
  @apply m-0 space-y-3 p-0;
  list-style: none;
}

.login-benefit-item {
  @apply flex items-start gap-3 rounded-2xl border border-primary-100/90 bg-white/80 px-4 py-3 text-sm text-neutral-800;
}

.benefit-icon {
  @apply mt-0.5 shrink-0 text-primary-700;
}

.login-form-panel {
  @apply relative z-10 flex w-full justify-center lg:justify-end;
  animation: fadeUp 0.55s ease both;
  animation-delay: 0.08s;
}

.login-orb {
  @apply pointer-events-none absolute rounded-full blur-3xl;
}

.login-orb--primary {
  @apply -left-20 -top-20 h-64 w-64 bg-primary-300/30;
}

.login-orb--secondary {
  @apply -bottom-24 -right-24 h-72 w-72 bg-secondary-300/30;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
