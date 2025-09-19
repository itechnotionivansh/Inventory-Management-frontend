import { useEffect, useState } from "react";
// import productsData from "../data/products.json";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import ProductGridCard from "../components/products/ProductGridCard";
import ProductModal from "../components/products/ProductModal";
import { getRole, getToken } from "../utils/authHelper";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = getRole();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getToken();
        const res = await fetch("http://localhost:5000/api/v1/products/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.products) setProducts(data.products);
      } catch {}
    };
    fetchProducts();
  }, []);

  // Add or update product in state after backend response
  const addProduct = (product) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts((prev) => [...prev, product]);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = getToken();
    try {
      const res = await fetch(`http://localhost:5000/api/v1/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
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
