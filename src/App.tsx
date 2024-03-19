import './App.css'
import Game from './Game'
import { SpeedInsights } from '@vercel/speed-insights/react'


function App() {
  return (
    <>
      <SpeedInsights />
      <Game />
    </>
  )
}

export default App
