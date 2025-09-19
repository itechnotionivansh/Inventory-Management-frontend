import CategoryCard from "./CategoryCard";

export default function CategoryList({
  categories,
  onAddProduct,
  onDeleteCategory,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          onAddProduct={onAddProduct}
          onDeleteCategory={onDeleteCategory}
        />
      ))}
    </div>
  );
}
