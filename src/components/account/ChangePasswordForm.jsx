import { useState } from "react";
// ...existing code...
import { getRole } from "../../utils/authHelper";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const role = getRole();
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let email = localStorage.getItem("email");
    // For admin, use configurable stored password
    if (role === "Admin" && email === "admin@gmail.com") {
      const storedAdminPassword =
        localStorage.getItem("admin_password") || "123456";
      if (currentPassword !== storedAdminPassword) {
        setErrors({ currentPassword: "Current password is incorrect." });
        return;
      }
      if (newPassword === currentPassword) {
        setErrors({ newPassword: "New password must differ from current." });
        return;
      }
      localStorage.setItem("admin_password", newPassword);
      setErrors({});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }
    // For registered users
    const userIndex = users.findIndex(
      (user) => user.email === email && user.password === currentPassword
    );
    if (userIndex === -1) {
      setErrors({ currentPassword: "Current password is incorrect." });
      return;
    }
    if (newPassword === currentPassword) {
      setErrors({ newPassword: "New password must differ from current." });
      return;
    }
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    setErrors({});
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
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
  );
}
