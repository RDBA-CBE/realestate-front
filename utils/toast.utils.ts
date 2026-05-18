export type ToastType = "success" | "error";

type Listener = (type: ToastType, message: string) => void;

const listeners: Listener[] = [];

export const toastEmitter = {
  emit(type: ToastType, message: string) {
    listeners.forEach((fn) => fn(type, message));
  },
  subscribe(fn: Listener) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },
};
