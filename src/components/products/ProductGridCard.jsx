import { useState } from "react";
import { getRole, getUsername } from "../../utils/authHelper";
import ColorChips from "../shared/ColorChips";
import TagBadge from "../shared/TagBadge";

export default function ProductGridCard({
  product,
  onDeleteProduct,
  onEditProduct,
}) {
  const role = getRole();
  const username = getUsername();
  const canEdit = role === "Admin" || product.uploader === username;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
  <div className="bg-primary-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow flex flex-col gap-2 items-start hover:shadow-lg transition relative w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-1 text-premium-accent">
        {product.name}
      </h3>
      <span className="text-[11px] sm:text-xs text-premium-blue mb-1">
        {product.category}
      </span>
      <span className="font-bold text-premium-gold text-sm sm:text-base mb-1">
        ₹{product.price}
      </span>
      <ColorChips colors={product.colors} />
      <div className="flex flex-wrap gap-1 mt-2">
        {product.tags.map((tag, idx) => (
          <TagBadge key={idx} tag={tag} />
        ))}
      </div>
      {canEdit && (
        <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">
          <button
            onClick={() => onEditProduct(product)}
            className="bg-[#9B59B6] hover:bg-[#8e44ad] text-white font-semibold py-2 px-4 rounded">
            Edit
          </button>
          {role === "Admin" && (
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-[10px] sm:text-xs">
              Delete
            </button>
          )}
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setIsConfirmOpen(false)}
          />
          <div className="relative bg-primary-800 w-80 rounded-xl shadow-lg p-5 z-10">
            <h4 className="text-lg font-semibold mb-2">Delete product?</h4>
            <p className="text-sm text-primary-200 mb-4">
              Are you sure you want to delete '{product.name}'? This action
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
                  onDeleteProduct(product.id);
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
