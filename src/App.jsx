import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import RegisterPage from "./pages/RegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AccountsPage from "./pages/AccountsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { getToken, getRole } from "./utils/authHelper";

// ✅ Base auth check
function ProtectedRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
}

// ✅ Auth + Role check
function RoleProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" />;

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected for all authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin only */}
      <Route
        path="/categories"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <CategoryPage />
          </RoleProtectedRoute>
        }
      />

      {/* Admin + User */}
      <Route
        path="/products"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "User"]}>
            <ProductPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "User"]}>
            <ChangePasswordPage />
          </RoleProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
