import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as productService from "../services/productService";
import * as categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import CountUp from "../components/CountUp";
import MagneticButton from "../components/MagneticButton";
import { getImageUrl } from "../utils/getImageUrl";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const [featuredData, categoriesData, latestData] = await Promise.all([
          productService.getFeaturedProducts(),
          categoryService.getCategories(),
          productService.getProducts({ limit: 8, sort: "newest" }),
        ]);
        setFeatured(featuredData);
        setCategories(categoriesData);
        setLatest(latestData.products);
      } catch (err) {
        setError(true);
        toast.error(err.response?.data?.message || "Could not load the store. Is the backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-[var(--color-danger)] text-sm text-center py-2 px-4">
          Couldn't reach the server. Make sure the backend is running and try refreshing.
        </div>
      )}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Browse categories</span>
          {categories.map((category) => (
            <Link key={category._id} to={`/category/${category.slug}`} className="shrink-0 rounded-full bg-[var(--color-bg-soft)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-navy)] hover:text-white">
              {category.name}
            </Link>
          ))}
          <Link to="/products" className="shrink-0 text-sm font-semibold text-[var(--color-navy)] hover:text-[var(--color-primary)]">All products →</Link>
        </div>
      </section>
      {/* Hero */}
      <section className="hero-grid overflow-hidden bg-[var(--color-navy)] text-white relative">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[var(--color-primary)]/20 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-[0.9fr_1.1fr] items-center gap-12 relative">
          <div className="reveal-up">
            <p className="uppercase tracking-[0.24em] text-xs font-bold text-[var(--color-cyan)] mb-5">Nexora marketplace / 2026</p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[0.96] mb-6 max-w-xl">
              Source smarter, <span className="text-[var(--color-primary)]">shop better.</span>
            </h1>
            <p className="text-slate-300 mb-8 max-w-md text-lg leading-relaxed">
              A focused marketplace for everyday products, transparent prices, and fast-ready picks.
            </p>
            <MagneticButton as={Link} to="/products" className="interactive-button inline-flex items-center gap-3 bg-[var(--color-primary)] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20">
              Explore products <span aria-hidden="true">↗</span>
            </MagneticButton>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-xl w-full md:justify-self-end reveal-up" style={{ animationDelay: "120ms" }}>
            <div className="interactive-lift row-span-2 rounded-[2rem] overflow-hidden min-h-[360px] bg-[var(--color-navy-light)] relative shadow-2xl">
              {featured[0]?.images?.[0] && <img src={getImageUrl(featured[0].images[0])} alt={featured[0].name} className="absolute inset-0 w-full h-full object-cover opacity-85" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[var(--color-cyan)] text-xs uppercase tracking-widest mb-1">Featured pick</p>
                <p className="font-semibold text-lg">{featured[0]?.name || "The everyday classic"}</p>
              </div>
            </div>
            <div className="interactive-lift rounded-[2rem] overflow-hidden min-h-[172px] bg-[var(--color-primary)] relative" style={{ animationDelay: "100ms" }}>
              {featured[1]?.images?.[0] && <img src={getImageUrl(featured[1].images[0])} alt={featured[1].name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80" />}
              <div className="absolute bottom-4 left-4 font-semibold">Built for now.</div>
            </div>
            <Link to="/products" className="interactive-lift rounded-[2rem] min-h-[172px] p-5 bg-[var(--color-cyan)] text-[var(--color-navy)] flex flex-col justify-between">
              <span className="text-3xl">✦</span>
              <span className="font-semibold">Shop all pieces <span aria-hidden="true">↗</span></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-7 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl shadow-[0_12px_35px_rgba(7,26,44,0.12)] border border-slate-100 divide-x divide-slate-100 overflow-hidden">
          {[
            ["Verified picks", "Curated products"],
            ["Fast dispatch", "Ready-to-ship stock"],
            ["Secure checkout", "Protected payments"],
            ["Easy returns", "30-day support"],
          ].map(([title, detail], index) => (
            <div key={title} className="interactive-lift p-4 md:p-5" style={{ animationDelay: `${index * 70}ms` }}>
              <p className="font-bold text-sm md:text-base">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pt-16 pb-4">
        <div className="flex items-end justify-between mb-6">
          <div><p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] font-bold mb-2">Shop by department</p><h2 className="text-3xl font-bold">What are you sourcing?</h2></div>
          <Link to="/products" className="hidden sm:block text-sm font-semibold hover:text-[var(--color-primary)]">See all categories ↗</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category, index) => (
            <div key={category._id} className={`group interactive-lift min-h-32 rounded-2xl p-5 flex flex-col justify-between text-white overflow-hidden relative ${["bg-[var(--color-navy)]", "bg-[var(--color-primary)]", "bg-[var(--color-navy-light)]", "bg-[#16766b]"][index % 4]}`} style={{ animationDelay: `${index * 90}ms` }}>
              <span className="absolute -right-3 -top-5 text-7xl font-bold opacity-10">0{index + 1}</span>
              <Link to={`/category/${category.slug}`} className="relative z-10 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest opacity-70">Department</span>
                <span className="font-bold text-lg group-hover:translate-x-1 transition-transform">{category.name} <span aria-hidden="true">↗</span></span>
              </Link>
              {(() => {
                const categoryProduct = [...featured, ...latest].find((product) => product.category?._id === category._id || product.category === category._id);
                return categoryProduct ? (
                  <button
                    type="button"
                    onClick={() => addItem(categoryProduct._id, 1)}
                    disabled={categoryProduct.stock === 0}
                    className="interactive-button relative z-10 self-start mt-3 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white hover:text-[var(--color-navy)] disabled:opacity-50"
                  >
                    Add to cart
                  </button>
                ) : null;
              })()}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-7">
          <div><p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] font-bold mb-2">Popular on Nexora</p><h2 className="text-3xl font-bold">Featured Products</h2></div>
          <Link to="/products" className="text-sm font-semibold hover:text-[var(--color-primary)]">View all ↗</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <section className="bg-[var(--color-bg-soft)] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-[1fr_1.5fr] gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] font-bold mb-2">Deals for today</p>
            <h2 className="text-3xl font-bold mb-3">Better prices, ready to move.</h2>
            <p className="text-slate-600 text-sm max-w-md">Discover limited offers across tech, watches, and useful home essentials. No endless scrolling required.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {latest.slice(0, 4).map((product) => <ProductCard key={`deal-${product._id}`} product={product} />)}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-7">
          <div><p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] font-bold mb-2">Just landed</p><h2 className="text-3xl font-bold">Latest Arrivals</h2></div>
          <Link to="/products" className="text-sm font-semibold hover:text-[var(--color-primary)]">Browse catalog ↗</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : latest.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[var(--color-navy)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Fast Shipping", desc: "Orders processed within 24 hours.", value: 24, suffix: "h" },
            { title: "Secure Checkout", desc: "Your data is encrypted and never shared.", value: 99, suffix: "%" },
            { title: "Easy Returns", desc: "30-day hassle-free returns on every order.", value: 30, suffix: "d" },
          ].map((item) => (
            <div key={item.title} className="border-t border-white/20 pt-5">
              <p className="text-3xl font-bold mb-2"><CountUp end={item.value} suffix={item.suffix} /></p>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
