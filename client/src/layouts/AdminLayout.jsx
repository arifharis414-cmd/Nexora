import { Outlet, Link, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex">
      <Toaster position="top-center" toastOptions={{ duration: 3200, style: { borderRadius: "16px", background: "#071a2c", color: "#fff", boxShadow: "0 20px 40px rgba(7, 26, 44, 0.24)" } }} />
      <aside className="w-56 bg-[var(--color-text)] text-white p-4 shrink-0">
        <Link to="/" className="text-lg font-bold block mb-6">Nexora Admin</Link>
        <nav className="flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-lg ${location.pathname === l.to ? "bg-[var(--color-primary)]" : "hover:bg-white/10"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-[var(--color-bg-soft)]">
        <Outlet />
      </main>
    </div>
  );
}
