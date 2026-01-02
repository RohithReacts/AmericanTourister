import React, { createContext, ReactNode, useContext, useState } from "react";

type ToastContextType = {
  showToast: (title: string, message: string) => void;
  hideToast: () => void;
  toast: { visible: boolean; title: string; message: string };
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const showToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    // Auto hide after 4 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
