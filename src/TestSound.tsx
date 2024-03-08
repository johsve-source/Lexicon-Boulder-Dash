import { useSoundManagerLogic } from './useSoundManagerLogic';

const TestSound = () => {
  const { playInteraction } = useSoundManagerLogic();

  /*   const handleButtonClick = () => {
    playInteraction('game-over', {
      loop: false,
      playOnce: true,
      duration: 5000,
    });
  }; */

  return (
    <div>
      <button
        onClick={() =>
          playInteraction('falling-stone', {
            loop: false,
            playOnce: true,
            duration: 5000,
          })
        }
      >
        Play Falling Stone
      </button>
    </div>
  );
};

export default TestSound;
