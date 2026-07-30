import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as categoryService from "../services/categoryService";
import * as productService from "../services/productService";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    categoryService
      .getCategoryBySlug(slug)
      .then(async (cat) => {
        setCategory(cat);
        const data = await productService.getProducts({ category: cat._id, limit: 20 });
        setProducts(data.products);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!loading && notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Category not found</h1>
        <Link to="/products" className="text-[var(--color-primary)] hover:underline">Browse all products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{category?.name || "Category"}</h1>
      <p className="text-gray-500 mb-6">{category?.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500 py-12">No products in this category yet.</p>
      )}
    </div>
  );
}
