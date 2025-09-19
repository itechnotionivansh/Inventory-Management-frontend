import { useState } from "react";
// ...existing code...
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      newErrors.email = "Invalid email format.";
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);
    if (!user) newErrors.email = "No user found with this email.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = "Password is required.";
    else if (newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const idx = users.findIndex((u) => u.email === email);
    users[idx].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    setErrors({});
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-900 text-primary-200">
      <form
        className="bg-primary-800 p-8 rounded-2xl shadow-lg w-80"
        onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-200">Forgot Password</h2>
        {step === 1 ? (
          <>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded bg-primary-700 text-primary-200 placeholder-primary-400"
                required
              />
              {errors.email && (
                <div className="text-red-600 text-sm mt-1">{errors.email}</div>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
              Next
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 rounded bg-primary-700 text-primary-200 placeholder-primary-400"
                required
              />
              {errors.newPassword && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.newPassword}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
              Reset Password
            </button>
          </>
        )}
      </form>
      {/* Removed NotificationPopup for validation */}
    </div>
  );
}
