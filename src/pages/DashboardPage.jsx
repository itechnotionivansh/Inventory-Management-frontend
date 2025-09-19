import Sidebar from "../components/layout/Sidebar";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { getRole, getUsername } from "../utils/authHelper";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = getRole();
  const username = getUsername();

  return (
    <div className="flex min-h-screen bg-primary-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar onSidebarToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-primary-200">
            Welcome, {role !== "admin" ? username : role}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/products" className="bg-primary-800 p-6 rounded-2xl shadow hover:bg-primary-700 transition">
              <h2 className="text-lg font-semibold mb-2 text-primary-200">Products</h2>
              <p className="text-primary-400">View and manage all products.</p>
            </Link>

            {role === "Admin" && (
              <Link
                to="/categories"
                className="bg-primary-800 p-6 rounded-2xl shadow hover:bg-primary-700 transition"
              >
                <h2 className="text-lg font-semibold mb-2 text-primary-200">Categories</h2>
                <p className="text-primary-400">
                  Add and manage product categories.
                </p>
              </Link>
            )}

            <Link to="/account" className="bg-primary-800 p-6 rounded-2xl shadow hover:bg-primary-700 transition">
              <h2 className="text-lg font-semibold mb-2 text-primary-200">Account</h2>
              <p className="text-primary-400">Manage your profile and change password.</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
