export interface ToastOptions {
  text?: string;
  description?: string;
  type?: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}
export type ToastType = "success" | "info" | "warning" | "error";

export const TYPE_CONFIG = {
  success: {
    icon: "mdi-check-circle",
    color: "#00C853",
  },
  info: {
    icon: "mdi-information",
    color: "#26C6DA",
  },
  warning: {
    icon: "mdi-alert",
    color: "#FF6F00",
  },
  error: {
    icon: "mdi-close-circle",
    color: "#B71C1C",
  },
} as const;

export function useToast() {
  const toasts = useState<any[]>("toasts", () => []);

  function show(options: ToastOptions) {
    const id = Date.now();
    const type = options.type ?? "info";

    const config = TYPE_CONFIG[type];

    toasts.value.push({
      id,
      text: options.text,
      description: options.description,
      icon: config.icon,
      color: config.color,
      action: options.action,
    });

    setTimeout(() => remove(id), options.duration ?? 3000);
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { show };
}
