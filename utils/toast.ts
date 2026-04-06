function success(text: string, opt?: ToastOptions) {
  useToast().show({ text, type: "success", ...opt });
}

function error(text: string, opt?: ToastOptions) {
  useToast().show({ text, type: "error", ...opt });
}

function info(text: string, opt?: ToastOptions) {
  useToast().show({ text, type: "info", ...opt });
}

function warning(text: string, opt?: ToastOptions) {
  useToast().show({ text, type: "warning", ...opt });
}

function show(opt: ToastOptions) {
  useToast().show(opt);
}

export default {
  success,
  error,
  info,
  warning,
  show,
};
