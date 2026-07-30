import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed! (demo only)");
    setEmail("");
  };

  return (
    <footer className="bg-[var(--color-text)] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-lg mb-2">
            <span className="brand-symbol w-8 h-8 rounded-lg bg-[var(--color-cyan)] text-[var(--color-navy)] flex items-center justify-center">N</span>
            <span className="brand-wordmark">NEXORA<span className="text-[var(--color-primary)]">.</span></span>
          </Link>
          <p className="text-gray-400">A small, honest online shop for watches, phones, accessories, and home goods.</p>
          <div className="flex gap-3 mt-4">
            <FaFacebook className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Categories</h4>
          <ul className="space-y-1">
            <li><Link to="/category/watches" className="hover:text-white">Watches</Link></li>
            <li><Link to="/category/smartphones" className="hover:text-white">Smartphones</Link></li>
            <li><Link to="/category/accessories" className="hover:text-white">Accessories</Link></li>
            <li><Link to="/category/home-kitchen" className="hover:text-white">Home &amp; Kitchen</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded-lg text-gray-900 text-sm"
            />
            <button className="bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-primary-dark)]">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-700">
        © {new Date().getFullYear()} Nexora. All rights reserved.
      </div>
    </footer>
  );
}
