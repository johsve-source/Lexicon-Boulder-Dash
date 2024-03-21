import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/*
 * Strict mode is removed because of the double rendering of useEffect. It       * renders twice for security reasons in Development mode.
 */

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
