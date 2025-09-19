import { useState } from "react";
// ...existing code...

export default function AddCategoryModal({ onClose, onAddCategory }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required!");
      return;
    }
    onAddCategory({ name });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
  className="bg-primary-800 p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Add Category</h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
            Add
          </button>
        </div>
      </form>
      {/* Removed NotificationPopup for validation */}
    </div>
  );
}
