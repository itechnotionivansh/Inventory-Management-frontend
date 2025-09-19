import ChangePasswordForm from "../components/account/ChangePasswordForm";
import Sidebar from "../components/layout/Sidebar";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";

export default function ChangePasswordPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-primary-900 text-primary-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onSidebarToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-primary-200">Change Password</h1>
            <ChangePasswordForm />
          </div>
        </main>
      </div>
    </div>
  );
}
