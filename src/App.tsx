import './App.css'
import Game from './Game'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Namepage } from './pages/Namepage'

function App() {
  return (
    <>
      <SpeedInsights />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game/>}/>
          <Route path="/name" element={<Namepage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
