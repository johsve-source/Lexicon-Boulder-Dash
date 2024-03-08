import { SoundManagerProvider } from './SoundManagerProvider';
import TestSound from './TestSound';

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
