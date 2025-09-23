import { useState } from "react";
// ...existing code...
import { getToken } from "../../utils/authHelper";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (!newPassword) newErrors.newPassword = "New password is required.";
    else if (newPassword.length < 8)
      newErrors.newPassword =
        "New password must be at least 8 characters long.";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "New passwords do not match.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const token = getToken();
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.details && Array.isArray(data.details)) {
          // Pydantic validation errors
          const errObj = {};
          data.details.forEach((d) => {
            if (d.loc && d.loc.length > 0) errObj[d.loc[d.loc.length-1]] = d.msg;
          });
          setErrors(errObj);
        } else {
          setErrors({ currentPassword: data.error || "Change password failed" });
        }
        return;
      }
      setErrors({});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPopup("Password changed successfully!");
      setTimeout(() => setPopup(""), 2000);
    } catch (err) {
      setErrors({ currentPassword: "Network error. Please try again." });
    }
  };

  return (
    <>
      {popup && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {popup}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-primary-800 p-8 rounded-2xl shadow">
      <div className="mb-4">
        <label className="block text-primary-200 mb-2" htmlFor="current-password">
          Current Password
        </label>
        <input
          type="password"
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
        {errors.currentPassword && (
          <div className="text-red-600 text-sm mt-1">
            {errors.currentPassword}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-primary-200 mb-2" htmlFor="new-password">
          New Password
        </label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
        {errors.newPassword && (
          <div className="text-red-600 text-sm mt-1">{errors.newPassword}</div>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-primary-200 mb-2" htmlFor="confirm-password">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
        {errors.confirmPassword && (
          <div className="text-red-600 text-sm mt-1">
            {errors.confirmPassword}
          </div>
        )}
      </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Update Password
        </button>
      </form>
    </>
  );
}
