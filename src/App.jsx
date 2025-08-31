import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home/Home"
import Register from "./pages/auth/Register"
import NotFound from "./pages/NotFound"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/Dashboard"
import ProfilWakilRakyat from "./pages/ProfilWakilRakyat"
import KotakAspirasi from "./pages/KotakAspirasi"
import ForumDiskusi from "./pages/forum/ForumDiskusi"
import PetaAspirasi from "./pages/PetaAspirasi"
import LiveStreaming from "./pages/LiveStreaming"
import TransparansiKebijakan from "./pages/TransparansiKebijakan/TransparansiKebijakan"

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profil-wakil-rakyat" element={<ProfilWakilRakyat />} />
      <Route path="/kotak-aspirasi" element={<KotakAspirasi />} />
      <Route path="/forum-diskusi" element={<ForumDiskusi />} />
      <Route path="/peta-aspirasi" element={<PetaAspirasi />} />
      <Route path="/live-streaming" element={<LiveStreaming />} />
      <Route path="/transparansi-kebijakan" element={<TransparansiKebijakan />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
