import { SoundManagerProvider } from './SoundManagerProvider';
import TestSound from './TestSound.tsx';

function App() {
  return (
    <>
      <SoundManagerProvider>
        <TestSound />
      </SoundManagerProvider>
    </>
  );
}

export default App;
