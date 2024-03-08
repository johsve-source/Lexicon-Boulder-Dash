// SoundManagerProvider.tsx
import React, { ReactNode } from 'react';
import { SoundManagerContext } from './SoundManagerContext';
import { useSoundManagerLogic } from './useSoundManagerLogic';

interface SoundManagerProviderProps {
  children: ReactNode;
}

export const SoundManagerProvider: React.FC<SoundManagerProviderProps> = ({
  children,
}) => {
  const soundManager = useSoundManagerLogic();

  return (
    <SoundManagerContext.Provider value={soundManager}>
      {children}
    </SoundManagerContext.Provider>
  );
};
