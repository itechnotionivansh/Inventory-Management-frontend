import { useEffect, useState } from "react";
import { getUsername, getToken } from "../../utils/authHelper";

const colorOptions = ["Black", "White", "Yellow", "Green", "Blue", "Red"];

export default function ProductModal({
  category,
  onClose,
  onAddProduct,
  id,
  name: initialName,
  price: initialPrice,
  colors: initialColors,
  tags: initialTags,
  category: initialCategory,
  uploader,
}) {
  const isCategoryContext =
    category && typeof category === "object" && "name" in category;
  const [name, setName] = useState(initialName || "");
  const [price, setPrice] = useState(initialPrice || "");
  const [colors, setColors] = useState(initialColors || []);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(initialTags || []);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || (isCategoryContext ? category.name : "")
  );
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ message: "", type: "info" });

  // Sync form fields when editing an existing product
  useEffect(() => {
    if (id) {
      setName(initialName || "");
      setPrice(initialPrice || "");
      setColors(initialColors || []);
      setTags(initialTags || []);
      setSelectedCategory(
        initialCategory || (isCategoryContext ? category.name : "")
      );
    }
  }, [
    id,
    initialName,
    initialPrice,
    initialColors,
    initialTags,
    initialCategory,
    category,
    isCategoryContext,
  ]);

  // Fetch categories from backend
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const res = await fetch("http://localhost:5000/api/v1/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.categories) setCategories(data.categories);
      } catch {}
    };
    fetchCategories();
  }, []);

  const handleColorChange = (color) => {
    if (colors.includes(color)) {
      setColors(colors.filter((c) => c !== color));
    } else {
      setColors([...colors, color]);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!price || isNaN(price) || Number(price) <= 0)
      newErrors.price = "Valid price is required.";
    const finalCategory = isCategoryContext ? category.name : selectedCategory;
    // No local duplicate check; backend will validate
    if (!finalCategory) newErrors.category = "Category is required.";
    if (colors.length === 0)
      newErrors.colors = "At least one color is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setPopup({ message: "Please fix the errors above.", type: "error" });
      return;
    }
    const finalCategory = isCategoryContext ? category.name : selectedCategory;
    const token = getToken();
    try {
      let res, data;
      if (id) {
        // Edit mode
        res = await fetch(`http://localhost:5000/api/v1/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            price: parseFloat(price),
            colors,
            tags,
            category_name: finalCategory,
          }),
        });
      } else {
        // Add mode
        res = await fetch("http://localhost:5000/api/v1/products/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            price: parseFloat(price),
            colors,
            tags,
            category_name: finalCategory,
          }),
        });
      }
      data = await res.json();
      if (!res.ok) {
        setPopup({ message: data.error || "Failed to save product.", type: "error" });
        return;
      }
      onAddProduct(data.product);
      setErrors({});
      setPopup({
        message: id ? "Product updated successfully!" : "Product added successfully!",
        type: "success",
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setPopup({ message: "Failed to update product.", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div className="bg-primary-800 p-6 rounded-2xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {id ? "Edit Product" : "Add Product"}
          {category ? ` to ${category.name}` : ""}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector only if not from Category page */}
          {!category && (
            <div className="mb-3">
              <label className="block mb-1 font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border p-2 rounded"
                required>
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.category}
                </div>
              )}
            </div>
          )}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            {errors.name && (
              <div className="text-red-600 text-sm mt-1">{errors.name}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            {errors.price && (
              <div className="text-red-600 text-sm mt-1">{errors.price}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Colors</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`px-3 py-1 rounded-full border ${
                    colors.includes(color)
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-100"
                  }`}
                  onClick={() => handleColorChange(color)}>
                  {color}
                </button>
              ))}
            </div>
            {errors.colors && (
              <div className="text-red-600 text-sm mt-1">{errors.colors}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1 rounded bg-green-600 text-white">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-200 rounded-full text-xs flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition">
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition`}>
              {id ? "Edit" : "Add Product"}
            </button>
          </div>
        </form>
        {popup.message && (
          <div
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white flex items-center transition-all duration-300 ${
              popup.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}>
            <span className="flex-1">{popup.message}</span>
            <button
              className="ml-4 text-lg font-bold focus:outline-none"
              onClick={() => setPopup({ message: "", type: "info" })}
              aria-label="Close notification">
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
