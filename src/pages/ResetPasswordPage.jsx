import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = "Password is required.";
    else if (newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters.";
    if (newPassword !== confirmNewPassword)
      newErrors.confirmNewPassword = "Passwords do not match.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrors({ api: data.error || "Reset failed" });
      }
    } catch (err) {
      setErrors({ api: "Network error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-900 text-primary-200">
      <form
        className="bg-primary-800 p-8 rounded-2xl shadow-lg w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-200">Reset Password</h2>
        {success ? (
          <div className="text-green-500 text-center mb-4">Password reset! Redirecting...</div>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 rounded bg-primary-700 text-primary-200 placeholder-primary-400"
                required
              />
              {errors.newPassword && (
                <div className="text-red-600 text-sm mt-1">{errors.newPassword}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full border p-2 rounded bg-primary-700 text-primary-200 placeholder-primary-400"
                required
              />
              {errors.confirmNewPassword && (
                <div className="text-red-600 text-sm mt-1">{errors.confirmNewPassword}</div>
              )}
            </div>
            {errors.api && <div className="text-red-600 text-sm mb-2">{errors.api}</div>}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              Reset Password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
