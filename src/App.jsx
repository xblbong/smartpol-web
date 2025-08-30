import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home/Home"
import Register from "./pages/auth/Register"
import NotFound from "./pages/NotFound"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
