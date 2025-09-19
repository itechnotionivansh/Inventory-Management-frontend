import { useState } from "react";
import { setAuth } from "../../utils/authHelper";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Check for admin credentials first (configurable via localStorage)
    const storedAdminPassword =
      localStorage.getItem("admin_password") || "123456";
    if (email === "admin@gmail.com" && password === storedAdminPassword) {
      setAuth("fake-jwt-token", "Admin", "Admin", email);
      navigate("/dashboard");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      setAuth("fake-jwt-token", user.role, user.name, user.email);
      navigate("/dashboard");
    } else {
      setErrors({ password: "Invalid credentials!" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
  className="bg-primary-800 p-6 rounded-2xl shadow-lg w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />
        {errors.email && (
          <div className="text-red-600 text-sm mt-1">{errors.email}</div>
        )}
      </div>
      <div className="mb-3">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />
        {errors.password && (
          <div className="text-red-600 text-sm mt-1">{errors.password}</div>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
        Login
      </button>
    </form>
  );
}
