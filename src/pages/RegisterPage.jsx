import { getToken } from "../utils/authHelper";
import { Navigate, Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  const token = getToken();
  if (token) return <Navigate to="/dashboard" />;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-900 text-primary-200">
      <RegisterForm />
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
