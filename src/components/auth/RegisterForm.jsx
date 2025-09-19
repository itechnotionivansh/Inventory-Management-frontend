import { useState } from "react";
// ...existing code...
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ email: data.error || "Registration failed" });
        return;
      }
      setErrors({});
      navigate("/login");
    } catch (err) {
      setErrors({ email: "Network error. Please try again." });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
  className="bg-primary-800 p-6 rounded-2xl shadow-lg w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />
        {errors.name && (
          <div className="text-red-600 text-sm mt-1">{errors.name}</div>
        )}
      </div>
      <div className="mb-3">
        <input
          type="email"
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
        className="w-full px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
        Register
      </button>
    </form>
  );
}
