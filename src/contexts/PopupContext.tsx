'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PopupType = 'success' | 'error' | 'warning' | 'info';

interface Popup {
  id: string;
  type: PopupType;
  title: string;
  message: string;
  duration?: number;
}

interface PopupContextType {
  showPopup: (type: PopupType, title: string, message: string, duration?: number) => void;
  hidePopup: (id: string) => void;
  popups: Popup[];
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popups, setPopups] = useState<Popup[]>([]);

  // Clear any existing popups on mount to prevent stale data
  useEffect(() => {
    setPopups([]);
  }, []);

  const showPopup = (type: PopupType, title: string, message: string, duration = 4000) => {
    const id = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPopup: Popup = { id, type, title, message, duration };

    setPopups(prev => [...prev, newPopup]);

    // Auto hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hidePopup(id);
      }, duration);
    }

    return id;
  };

  const hidePopup = (id: string) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, popups }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
}
