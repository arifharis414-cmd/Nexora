import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as productService from "../services/productService";
import * as categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import toast from "react-hot-toast";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => toast.error("Could not load categories"));
  }, []);

  useEffect(() => {
    setLoading(true);
    productService
      .getProducts({ page, category, sort, limit: 12 })
      .then((data) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .catch(() => toast.error("Could not load products"))
      .finally(() => setLoading(false));
  }, [page, category, sort]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== "page") params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={category} onChange={(e) => updateParam("category", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500 py-12">No products match your filters.</p>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam("page", i + 1)}
              className={`w-9 h-9 rounded-lg text-sm ${page === i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-white border border-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
