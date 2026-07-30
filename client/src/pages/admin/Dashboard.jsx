import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data));
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    ["Users", stats.userCount],
    ["Products", stats.productCount],
    ["Orders", stats.orderCount],
    ["Revenue", `$${stats.totalRevenue}`],
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold mb-3">Low Stock Products (≤ 5 units)</h2>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">All products are well stocked.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {stats.lowStockProducts.map((p) => (
              <li key={p._id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="text-[var(--color-danger)] font-medium">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
