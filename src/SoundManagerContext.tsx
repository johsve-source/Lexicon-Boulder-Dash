// SoundManagerContext.tsx
import { createContext } from 'react';
import { SoundManagerContextProps } from './interface';

export const SoundManagerContext = createContext<
  SoundManagerContextProps | undefined
>(undefined);
