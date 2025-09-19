import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useState } from "react";

export default function AccountsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-primary-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onSidebarToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="block flex-col gap-6 items-center w-full max-w-md p-8 bg-primary-800 rounded-2xl shadow-lg">
            <button
              className="w-full px-6 py-4 rounded-lg bg-[#9B59B6] text-white font-semibold text-lg hover:bg-[#8e44ad] transition"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
