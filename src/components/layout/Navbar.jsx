import { getRole, getUsername } from "../../utils/authHelper";
import { useLocation } from "react-router-dom";

export default function Navbar({ onSidebarToggle }) {
  const role = getRole();
  const username = getUsername();
  const location = useLocation();

  // Map paths to headings
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/categories": "Categories",
    "/account": "Account",
    "/change-password": "Change Password",
    "/login": "Login",
    "/register": "Register",
    "/forgot-password": "Forgot Password"
  };
  const heading = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="w-full bg-primary-800 shadow px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle for medium or less screens */}
        <button
          className="md:hidden text-primary-400 hover:text-primary-200 text-2xl"
          onClick={onSidebarToggle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-primary-200">{heading}</h1>
      </div>
      <span className="text-primary-400">
        Logged in as:&nbsp;
        {role !== "admin" ? (
          <>
            {username} <span className="text-xs text-primary-200">({role})</span>
          </>
        ) : null}
      </span>
    </header>
  );
}
