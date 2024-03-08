import { useState } from 'react';
import { determineSoundFile } from './soundUtil.ts';
import { DEFAULT_DURATION } from './soundConstants.ts';

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

  /**
   * A function that plays a specific interaction sound based on the given type and options.
   *
   * @param {string} interactionType - the type of interaction sound to be played
   * @param {SoundOptions} options - (Optional) options for playing the sound
   * @return {void}
   */
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
      }, options.duration || DEFAULT_DURATION);
    }
  };

  return { ...state, playInteraction };
};
