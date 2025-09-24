
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      newErrors.email = "Invalid email format.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setErrors({ api: data.error || "Failed to send reset email" });
      }
    } catch (err) {
      setErrors({ api: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-900 text-primary-200">
      <form
        className="bg-primary-800 p-8 rounded-2xl shadow-lg w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-200">Forgot Password</h2>
        {success ? (
          <div className="text-green-500 text-center mb-4">If the email exists, a reset link has been sent.</div>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded bg-primary-700 text-primary-200 placeholder-primary-400"
                required
                disabled={loading}
              />
              {errors.email && (
                <div className="text-red-600 text-sm mt-1">{errors.email}</div>
              )}
            </div>
            {errors.api && <div className="text-red-600 text-sm mb-2">{errors.api}</div>}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
