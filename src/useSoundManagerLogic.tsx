import { useState, useEffect } from 'react';
import { determineSoundFile } from './soundUtil.ts';
import * as SoundConstants from './soundConstants';

interface SoundOptions {
  loop?: boolean;
  playOnce?: boolean;
  duration?: number;
}

export const useSoundManagerLogic = () => {
  const [state, setState] = useState<{
    playing: boolean;
    soundFile: string;
    loop: boolean;
  }>({ playing: false, soundFile: '', loop: false });

  useEffect(() => {
    const audio = new Audio(state.soundFile);
    audio.loop = state.loop;

    if (state.playing) {
      audio.play();
    } else {
      audio.pause();
    }

    if (!state.playing && state.soundFile) {
      setTimeout(() => {
        setState({ playing: false, soundFile: '', loop: false });
      }, SoundConstants.DEFAULT_DURATION);
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [state]);

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = {}
  ): void => {
    const calculatedSoundFile = determineSoundFile(interactionType);

    setState({
      playing: true,
      soundFile: calculatedSoundFile,
      loop: !!options.loop,
    });

    if (!options.playOnce) {
      setTimeout(() => {
        setState({ playing: false, soundFile: '', loop: false });
      }, options.duration || SoundConstants.DEFAULT_DURATION);
    }
  };

  return { ...state, playInteraction };
};