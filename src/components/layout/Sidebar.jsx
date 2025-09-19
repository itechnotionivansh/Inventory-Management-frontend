import { NavLink, useNavigate } from "react-router-dom";
import { getRole, clearAuth } from "../../utils/authHelper";

export default function Sidebar({ isOpen, onClose }) {
  const role = getRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded transition-colors font-semibold ${
      isActive ? "bg-primary-700 text-primary-200" : "hover:bg-primary-700 text-primary-400"
    }`;

  return (
    <>
      {/* Overlay for mobile/medium screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-60 md:w-72 h-full md:h-screen bg-primary-800 text-primary-200 flex flex-col border-r-2 border-primary-700 shadow-lg transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ height: "100vh", maxHeight: "100vh" }}>
        <div className="flex justify-between items-center px-4 pt-4 mb-6">
          <h2 className="text-xl font-bold text-primary-200">Dashboard</h2>
          {/* Close button for mobile/medium screens */}
          <button
            className="md:hidden text-primary-400 hover:text-primary-200 text-2xl"
            onClick={onClose}>
            &times;
          </button>
        </div>
        <nav className="flex flex-col gap-2 px-2">
          <NavLink to="/dashboard" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>

          {role === "Admin" && (
            <NavLink to="/categories" className={linkClass}>
              Categories
            </NavLink>
          )}
          <NavLink to="/account" className={linkClass}>
            Account
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto m-4 bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-white">
          Logout
        </button>
      </aside>
    </>
  );
}
