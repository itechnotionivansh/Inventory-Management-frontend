// src/utils/localStorageHelper.js
// Centralized localStorage helper for categories and products

export const getCategories = () => {
  const stored = localStorage.getItem("categories");
  return stored ? JSON.parse(stored) : [];
};

export const setCategories = (categories) => {
  localStorage.setItem("categories", JSON.stringify(categories));
};

export const getProducts = () => {
  const stored = localStorage.getItem("products");
  return stored ? JSON.parse(stored) : [];
};

export const setProducts = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};

export const clearAll = () => {
  localStorage.removeItem("categories");
  localStorage.removeItem("products");
};
