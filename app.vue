<template>
  <VApp>
    <div
      :class="[
        'app-shell flex min-h-dvh flex-col text-primary-900',
        user ? 'app-shell--authed' : 'app-shell--guest',
      ]"
    >
      <NavBar />
      <v-btn @click="toastTest"> 測試 Toast </v-btn>
      <main class="flex-1">
        <div class="text-primary-900">
          <NuxtPage />
        </div>
      </main>
      <footer :class="['py-6 text-center text-sm backdrop-blur', footerClass]">
        © {{ year }} 九条夏目
      </footer>
    </div>
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  </VApp>
</template>

<script setup lang="ts">
const { user } = useAuth();
const footerClass = computed(() =>
  user.value
    ? "border-t border-primary-200/80 bg-primary-50/78 text-primary-800"
    : "border-t border-neutral-300/60 bg-white/70 text-neutral-800",
);

function toastTest() {
  toast.success("這是一條成功訊息！");
}

const year = new Date().getFullYear();
</script>

<style lang="scss">
.app-shell--guest {
  background-image:
    radial-gradient(
      circle at 12% 8%,
      rgb(255 255 255 / 0.72) 0,
      rgb(255 255 255 / 0) 40%
    ),
    radial-gradient(
      circle at 90% 4%,
      rgb(255 226 193 / 0.38) 0,
      rgb(255 226 193 / 0) 44%
    ),
    linear-gradient(160deg, #f4f8ff 0%, #e8f0ff 52%, #fff2df 100%);
}

.app-shell--authed {
  background-image:
    radial-gradient(
      circle at 12% 8%,
      rgb(214 233 255 / 0.68) 0,
      rgb(214 233 255 / 0) 40%
    ),
    radial-gradient(
      circle at 88% 4%,
      rgb(255 201 146 / 0.3) 0,
      rgb(255 201 146 / 0) 44%
    ),
    linear-gradient(162deg, #e9f2ff 0%, #d7e7ff 54%, #ffe3c3 100%);
}
</style>
