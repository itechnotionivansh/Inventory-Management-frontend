import { useEffect, useState } from "react";
// import categoriesData from "../data/categories.json";
import { getToken } from "../utils/authHelper";
import CategoryList from "../components/categories/CategoryList";
import ProductModal from "../components/products/ProductModal";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import AddCategoryModal from "../components/categories/AddCategoryModal";
import { getRole } from "../utils/authHelper";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = getRole();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const res = await fetch("http://localhost:5000/api/v1/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.categories) {
          // Add productCount as 0 (optional: fetch product counts separately if needed)
          setCategories(data.categories.map(cat => ({ ...cat, productCount: 0 })));
        }
      } catch {}
    };
    fetchCategories();
  }, []);

  const handleAddProductClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleProductAdded = (newProduct) => {
    // Optionally, refetch categories or update productCount if needed
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleAddCategory = async (newCategory) => {
    const token = getToken();
    try {
      const res = await fetch("http://localhost:5000/api/v1/categories/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory.name }),
      });
      const data = await res.json();
      if (res.ok && data.category) {
        setCategories((prev) => [...prev, { ...data.category, productCount: 0 }]);
      }
    } catch {}
  };

  const handleDeleteCategory = async (categoryId) => {
    const token = getToken();
    try {
      const res = await fetch(`http://localhost:5000/api/v1/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      }
    } catch {}
  };

  return (
    <div className="flex min-h-screen bg-primary-900 text-primary-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onSidebarToggle={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-200">Categories</h1>
            {role === "Admin" && (
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition text-sm sm:text-base">
                Add Category
              </button>
            )}
          </div>
          <CategoryList
            categories={categories}
            onAddProduct={handleAddProductClick}
            onDeleteCategory={handleDeleteCategory}
          />
          {showModal && (
            <ProductModal
              category={selectedCategory}
              onClose={() => setShowModal(false)}
              onAddProduct={handleProductAdded}
            />
          )}
          {showAddCategoryModal && (
            <AddCategoryModal
              onClose={() => setShowAddCategoryModal(false)}
              onAddCategory={handleAddCategory}
            />
          )}
          {showSuccess && (
            <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              Product added successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
