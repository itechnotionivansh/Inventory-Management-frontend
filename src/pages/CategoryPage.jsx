import { useEffect, useState } from "react";
import categoriesData from "../data/categories.json";
import { getCategories, getProducts } from "../utils/localStorageHelper";
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
    // Load categories and products using helper
    const categories = getCategories().length
      ? getCategories()
      : categoriesData;
    const products = getProducts();

    // Count products per category
    const updatedCategories = categories.map((cat) => {
      const count = products.filter((p) => p.category === cat.name).length;
      return { ...cat, productCount: count };
    });
    setCategories(updatedCategories);
    setCategories(updatedCategories);
  }, []);

  const handleAddProductClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleProductAdded = (newProduct) => {
    // Add product to localStorage
    const stored = localStorage.getItem("products");
    const products = stored ? JSON.parse(stored) : [];
    const updatedProducts = [
      ...products,
      { ...newProduct, id: products.length + 1, rating: { rate: 0, count: 0 } },
    ];
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Update category product count
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, productCount: cat.productCount + 1 }
          : cat
      )
    );
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleAddCategory = (newCategory) => {
    const updated = [
      ...categories,
      { ...newCategory, id: categories.length + 1, productCount: 0 },
    ];
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  };

  const handleDeleteCategory = (categoryId) => {
    const updated = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
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
