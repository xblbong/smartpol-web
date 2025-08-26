import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Register from "./pages/auth/Register"
import NotFound from "./pages/NotFound"
import Login from "./pages/auth/Login"

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
