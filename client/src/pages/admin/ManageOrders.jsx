import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get("/orders").then((r) => setOrders(r.data));
  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success("Order status updated");
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-soft)] text-left">
            <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-gray-100">
                <td className="p-3">#{o._id.slice(-6)}</td>
                <td className="p-3">{o.user?.name} <br /><span className="text-gray-400">{o.user?.email}</span></td>
                <td className="p-3">${o.total}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-center text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
}
