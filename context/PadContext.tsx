import React, { createContext, useContext } from 'react';
import { PadData } from '../types';

interface PadContextValue {
  pads: PadData[];
  onUpdatePad: (id: number, data: Partial<PadData>) => void;
  onPlayPad: (id: number) => void;
}

const PadContext = createContext<PadContextValue | null>(null);

export const usePadContext = (): PadContextValue => {
  const ctx = useContext(PadContext);
  if (!ctx) {
    throw new Error('usePadContext must be used inside a PadProvider');
  }
  return ctx;
};

export const PadProvider: React.FC<PadContextValue & { children: React.ReactNode }> = ({
  pads,
  onUpdatePad,
  onPlayPad,
  children,
}) => {
  return (
    <PadContext.Provider value={{ pads, onUpdatePad, onPlayPad }}>
      {children}
    </PadContext.Provider>
  );
};
