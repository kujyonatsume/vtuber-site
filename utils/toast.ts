type ToastInput = string | Omit<ToastOptions, "type">;

function show(type: ToastType, opt: ToastInput) {
  const normalized = typeof opt === "string" ? { text: opt } : opt;
  useToast().show({ ...normalized, type });
}

function success(opt: ToastInput) {
  show("success", opt);
}

function error(opt: ToastInput) {
  show("error", opt);
}

function info(opt: ToastInput) {
  show("info", opt);
}

function warning(opt: ToastInput) {
  show("warning", opt);
}

function confirm(opt: ToastInput): Promise<boolean> {
  return new Promise((resolve) => {
    const normalized = typeof opt === "string" ? { text: opt } : opt;
    const baseAction = normalized.action;
    let settled = false;
    const settle = (result: boolean) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    show("info", {
      ...normalized,
      duration: Math.min(Math.max(normalized.duration ?? 0, 10000), 30000),
      action: {
        ...baseAction,
        label: baseAction?.label ?? "確定",
        onClick() {
          baseAction?.onClick?.();
          settle(true);
        },
        onClose() {
          baseAction?.onClose?.();
          settle(false);
        },
      },
    });
  });
}

export default {
  success,
  error,
  info,
  warning,
  confirm,
  show,
};
