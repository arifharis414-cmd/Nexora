import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MagneticButton from "./MagneticButton";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-navy)]/80 backdrop-blur-2xl border-b border-white/10 text-white shadow-[0_10px_40px_rgba(7,26,44,0.16)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 group" aria-label="Nexora home">
          <span className="brand-symbol w-10 h-10 rounded-xl bg-[var(--color-cyan)] text-[var(--color-navy)] flex items-center justify-center shadow-[0_0_24px_rgba(125,227,208,0.2)] group-hover:rotate-6">
            N
          </span>
          <span className="brand-wordmark text-xl font-bold tracking-tight">NEXORA<span className="text-[var(--color-primary)]">.</span></span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for today?"
            className="w-full bg-white/10 border border-white/15 rounded-l-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:border-[var(--color-cyan)]"
          />
          <button type="submit" className="bg-[var(--color-primary)] text-white px-4 rounded-r-xl hover:bg-[var(--color-primary-dark)]">
            <FaSearch size={14} />
          </button>
        </form>

        <nav className="hidden md:flex items-center gap-5 ml-auto text-sm text-slate-200">
          <Link to="/products" className="hover:text-[var(--color-cyan)]">Products</Link>
          <Link to="/wishlist" className="relative hover:text-[var(--color-cyan)]"><FaHeart size={18} /></Link>
          <Link to="/cart" id="cart-fly-target" className="relative hover:text-[var(--color-cyan)]">
            <FaShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-danger)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="hover:text-[var(--color-cyan)]"><FaUser size={16} /></Link>
              {user.role === "admin" && <Link to="/admin" className="font-medium hover:text-[var(--color-cyan)]">Admin</Link>}
              <button onClick={logout} className="text-gray-500 hover:text-[var(--color-danger)]">Logout</button>
            </div>
          ) : (
            <MagneticButton as={Link} to="/login" className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl hover:bg-[var(--color-primary-dark)]">
              Login
            </MagneticButton>
          )}
        </nav>

        <button className="md:hidden ml-auto text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm text-slate-200">
          <form onSubmit={handleSearch} className="flex">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for today?"
              className="w-full bg-white/10 border border-white/15 rounded-l-xl px-3 py-2 text-sm text-white placeholder:text-slate-300"
            />
            <button type="submit" className="bg-[var(--color-primary)] text-white px-3 rounded-r-xl"><FaSearch size={14} /></button>
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({itemCount})</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              {user.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={logout} className="text-left text-[var(--color-danger)]">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
