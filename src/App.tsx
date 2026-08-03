import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Match from "./pages/match"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </BrowserRouter>
  )
}