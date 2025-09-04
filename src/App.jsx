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
import AppDashboard from "./pages/admin/Dashboard"
import ReportPolling from "./pages/admin/ReportPolling"
import ReportChatbot from "./pages/admin/ReportChatbot"
import Dashboard from "./pages/admin/Dashboard"
import UserManagement from "./pages/admin/UserManagement"
import PollingManagement from "./pages/admin/PollingManagement"
import PoliciesManagement from "./pages/admin/PoliciesManagement"
import AllUsers from "./pages/admin/AllUsers"
import AddUser from "./pages/admin/AddUser"
import Roles from "./pages/admin/Roles"
import DailyReport from "./pages/admin/DailyReport"
import MonthlyReport from "./pages/admin/MonthlyReport"
import AnnualReport from "./pages/admin/AnnualReport"
import Analytics from "./pages/admin/Analytics"

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
        // <AdminProtectedRoute>
          <Home />
        // </AdminProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={
        // <AdminProtectedRoute>
          <UserManagement />
        // </AdminProtectedRoute> 
      } />
      <Route path="/admin/users/all" element={
        // <AdminProtectedRoute>
          <AllUsers />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/users/add" element={
        // <AdminProtectedRoute>
          <AddUser />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/users/roles" element={
        // <AdminProtectedRoute>
          <Roles />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/polling" element={
        // <AdminProtectedRoute>
          <PollingManagement />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/policies" element={
        // <AdminProtectedRoute>
          <PoliciesManagement />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/reports/daily" element={
        // <AdminProtectedRoute>
          <DailyReport />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/reports/monthly" element={
        // <AdminProtectedRoute>
          <MonthlyReport />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/reports/annual" element={
        // <AdminProtectedRoute>
          <AnnualReport />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/reports/polling" element={
        // <AdminProtectedRoute>
          <ReportPolling />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/reports/chatbot" element={
        // <AdminProtectedRoute>
          <ReportChatbot />
        // </AdminProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        // <AdminProtectedRoute>
          <Analytics />
        // </AdminProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
