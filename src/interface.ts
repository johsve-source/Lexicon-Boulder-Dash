export interface SoundManagerContextProps {
  playing: boolean;
  soundFile: string;
  loop: boolean;
  playInteraction: (interactionType: string, options?: SoundOptions) => void;
}

interface SoundOptions {
  loop?: boolean;
  playOnce?: boolean;
  duration?: number;
}
