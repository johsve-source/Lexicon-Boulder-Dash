import './App.css'
import Game from './Game'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Namepage } from './pages/Namepage'
import LevelClear from './pages/LevelClear'

function App() {
  return (
    <>
      <SpeedInsights />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game/>}/>
          <Route path="/name" element={<Namepage/>} />
          <Route path="/levelclear" element={<LevelClear/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
