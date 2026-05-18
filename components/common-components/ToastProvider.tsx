"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

// Simple event emitter — works outside React (called from function.utils)
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

let idCounter = 0;
const DURATION = 3500;

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = toastEmitter.subscribe((type, message) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, DURATION);
    });
    return unsub;
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-slide-in
            ${toast.type === "success"
              ? "bg-emerald-100 border-emerald-500 text-gray-800"
              : "bg-red-100  border-red-500 text-gray-800"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 shrink-0 " />
          )}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
