export type KoyukiMode = "cute" | "battle";

export function useKoyukiMode() {
  const mode = useLocalStorage<KoyukiMode>("mode", "cute");
  const isCute = computed(() => mode.value === "cute");

  const toggleMode = () => {
    mode.value = mode.value === "cute" ? "battle" : "cute";
  };

  return {
    mode,
    isCute,
    toggleMode,
  };
}
