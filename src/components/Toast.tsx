import React, { useEffect } from 'react';
import { Icon } from '../icons';

export interface ToastMessage {
  id: number;
  title: string;
  body: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="nbn">
      <div className="ni">
        <Icon name="i:bell" size="18px" />
      </div>
      <div style={{ minWidth: 0 }}>
        <b>{toast.title}</b>
        <span className="t">{toast.body}</span>
      </div>
    </div>
  );
};
