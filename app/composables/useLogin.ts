export function useLogin() {
  const { user, loading, logout, refresh } = useAuth();
  const loginTimer = useState<ReturnType<typeof setTimeout> | null>(
    "login:timer",
    () => null,
  );
  const loginRedirect = useState<string | null>("login:redirect", () => null);
  const route = useRoute();
  const drawer = useState("login:drawer", () => false);
  const loginOpen = useState("login:open", () => false);

  onBeforeUnmount(() => {
    if (loginTimer.value) {
      clearTimeout(loginTimer.value);
      loginTimer.value = null;
    }
  });

  // SSR→CSR 首屏同步
  onMounted(() => {
    if (!user.value) refresh();
  });

  watch(
    () => route.fullPath,
    () => {
      drawer.value = false;
      loginOpen.value = false;
    },
  );

  function normalizeRedirect(raw?: unknown) {
    if (typeof raw !== "string") return null;

    const value = raw.trim();
    if (!value.startsWith("/") || value.startsWith("//")) return null;
    return value;
  }

  function openDialog() {
    loginRedirect.value = normalizeRedirect(route.fullPath);

    if (loginTimer.value) {
      clearTimeout(loginTimer.value);
      loginTimer.value = null;
    }

    if (drawer.value) {
      drawer.value = false;
      loginTimer.value = setTimeout(() => {
        loginOpen.value = true;
        loginTimer.value = null;
      }, 180);
      return;
    }

    loginOpen.value = true;
  }

  return {
    user,
    loading,
    loginOpen,
    drawer,
    logout,
    openDialog,
    loginRedirect,
  };
}
