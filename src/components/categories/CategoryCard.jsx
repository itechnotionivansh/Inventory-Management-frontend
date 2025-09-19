import { useState } from "react";
import { getRole } from "../../utils/authHelper";

export default function CategoryCard({
  category,
  onAddProduct,
  onDeleteCategory,
}) {
  const role = getRole();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <div className="p-4 sm:p-5 md:p-6 bg-primary-800 rounded-xl shadow flex flex-col items-center w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-2">
        {category.name}
      </h3>
      <p className="mb-2 text-primary-200 text-sm sm:text-base">
        Products: {category.productCount}
      </p>
      <button
        onClick={() => onAddProduct(category)}
        className="bg-[#9B59B6] text-white w-full py-1.5 sm:py-2 rounded hover:bg-[#8e44ad] mb-2 text-sm sm:text-base font-semibold">
        Add Product
      </button>
      {role === "Admin" && (
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="bg-red-500 text-white w-full py-1.5 sm:py-2 rounded hover:bg-red-600 text-sm sm:text-base font-semibold">
          Delete
        </button>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setIsConfirmOpen(false)}
          />
          <div className="relative bg-primary-800 w-80 rounded-xl shadow-lg p-5 z-10">
            <h4 className="text-lg font-semibold mb-2">Delete category?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete '{category.name}'? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm"
                onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                onClick={() => {
                  onDeleteCategory(category.id);
                  setIsConfirmOpen(false);
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
