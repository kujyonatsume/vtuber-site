export type ToastInput = string | Omit<ToastOptions, "type">;
export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastOptions {
  type: ToastType;
  text: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick?: () => void;
    onClose?: () => void;
  };
}

export interface IToast extends ToastOptions {
  id: number;
  icon: string;
  color: string;
  remove(): void;
}

export const TYPE_CONFIG = {
  success: { icon: "mdi-check-circle", color: "#00C853" },
  info: { icon: "mdi-information", color: "#26C6DA" },
  warning: { icon: "mdi-alert", color: "#FF6F00" },
  error: { icon: "mdi-close-circle", color: "#B71C1C" },
} as const;

export const toast = {
  get list() {
    const stage = useState<IToast[]>("toasts", () => []);
    stage.value = stage.value.filter((_, i) => i >= stage.value.length - 5);
    return stage;
  },

  remove(id: number) {
    const list = this.list.value;
    const target = list.find((t) => t.id === id);
    if (!target) return;

    this.list.value = list.filter((t) => t.id !== id);
    target.action?.onClose?.();
  },

  show(options: ToastOptions) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const type = options.type ?? "info";
    const duration = options.duration ?? 3000;

    const item: IToast = {
      id,
      ...TYPE_CONFIG[type],
      ...options,
      type,
      duration,
      remove: () => this.remove(id),
    };

    this.list.value.push(item);

    if (duration > 0) {
      setTimeout(() => {
        this.list.value = this.list.value.filter((t) => t.id !== id);
        item.action?.onClose?.();
      }, duration);
    }
  },

  toast(type: ToastType, opt: ToastInput) {
    const normalized = typeof opt === "string" ? { text: opt } : opt;
    this.show({ ...normalized, type });
  },

  success(opt: ToastInput) {
    this.toast("success", opt);
  },

  error(opt: ToastInput) {
    this.toast("error", opt);
  },

  info(opt: ToastInput) {
    this.toast("info", opt);
  },

  warning(opt: ToastInput) {
    this.toast("warning", opt);
  },

  confirm(opt: ToastInput): Promise<boolean> {
    return new Promise((resolve) => {
      const normalized = typeof opt === "string" ? { text: opt } : opt;
      const baseAction = normalized.action;
      let settled = false;

      const settle = (result: boolean) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      this.show({
        ...normalized,
        type: "info",
        duration: Math.min(Math.max(normalized.duration ?? 0, 10000), 30000),
        action: {
          ...baseAction,
          label: baseAction?.label ?? "確定",
          onClick: () => {
            baseAction?.onClick?.();
            settle(true);
          },
          onClose: () => {
            baseAction?.onClose?.();
            settle(false);
          },
        },
      });
    });
  },
};

export default toast;
