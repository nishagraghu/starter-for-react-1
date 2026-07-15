import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { checkSession, exchangeToken } from "./store/authSlice";
import store from "./store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import Contacts from "./pages/Contacts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Users from "./pages/users";
import Teams from "./pages/teams";
import AuditLogs from "./pages/AuditLogs";

function AppRoutes() {
  const dispatch = useDispatch();
  const { user, backendUser, isSuperadminTeamMember } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    if (user && !backendUser) {
      if (user.$id && user.email) {
        dispatch(exchangeToken({ userId: user.$id, email: user.email }));
      }
    }
  }, [user, backendUser, dispatch]);

  const isAdmin = backendUser?.permissions?.includes("*") || backendUser?.role === "super_admin" || backendUser?.role === "admin";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        {isSuperadminTeamMember && (
          <>
            <Route path="/admin/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
          </>
        )}
        {isAdmin && (
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
        )}
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster richColors />
      </BrowserRouter>
    </Provider>
  );
}
