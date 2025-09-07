import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home/Home"
import Settings from "./pages/Settings"
import NikVerification from "./pages/NikVerification"
import Polling from "./pages/Polling"
import Policies from "./pages/Policies"
import Credits from "./pages/Credits"
import Admin from "./pages/Admin"
import NotFound from "./pages/NotFound"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import AdminLogin from "./pages/auth/AdminLogin"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminProtectedRoute from "./components/AdminProtectedRoute"

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/nik-verification" element={
        <ProtectedRoute>
          <NikVerification />
        </ProtectedRoute>
      } />
      <Route path="/polling" element={
        <ProtectedRoute>
          <Polling />
        </ProtectedRoute>
      } />
      <Route path="/policies" element={
        <ProtectedRoute>
          <Policies />
        </ProtectedRoute>
      } />
      <Route path="/credits" element={
        <ProtectedRoute>
          <Credits />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <Admin />
        </AdminProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <AdminProtectedRoute>
          <Admin />
        </AdminProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
