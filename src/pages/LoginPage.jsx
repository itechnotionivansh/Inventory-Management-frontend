import { getToken } from "../utils/authHelper";
import { Link, Navigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  const token = getToken();
  if (token) return <Navigate to="/dashboard" />;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-900 text-primary-200">
      <LoginForm />
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-400 hover:underline">
          Register here
        </Link>
      </p>
      <p className="mt-2">
        <Link to="/forgot-password" className="text-blue-400 hover:underline">
          Forgot Password?
        </Link>
      </p>
    </div>
  );
}
