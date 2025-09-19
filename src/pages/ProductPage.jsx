import { useEffect, useState } from "react";
import productsData from "../data/products.json";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import ProductGridCard from "../components/products/ProductGridCard";
import ProductModal from "../components/products/ProductModal";
import { getRole } from "../utils/authHelper";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = getRole();

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(productsData);
      localStorage.setItem("products", JSON.stringify(productsData));
    }
  }, []);

  const addProduct = (newProduct) => {
    let updated;
    if (editingProduct) {
      // Edit existing product: merge updates into current item
      updated = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...newProduct } : p
      );
    } else {
      // Add new product
      updated = [
        ...products,
        {
          ...newProduct,
          id: products.length + 1,
          rating: { rate: 0, count: 0 },
        },
      ];
    }
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const handleDeleteProduct = (productId) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen bg-primary-900 text-primary-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onSidebarToggle={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-200">Products</h1>
            {role === "Admin" && (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingProduct(null);
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition text-sm sm:text-base">
                Add Product
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {products.map((product) => (
              <ProductGridCard
                key={product.id}
                product={product}
                onDeleteProduct={handleDeleteProduct}
                onEditProduct={(prod) => {
                  setEditingProduct(prod);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onAddProduct={addProduct}
          {...(editingProduct ? editingProduct : {})}
        />
      )}
    </div>
  );
}
