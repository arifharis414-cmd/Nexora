import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import PageTransition from "../components/PageTransition";

// Wraps every public page with the shared Navbar + Footer
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" toastOptions={{ duration: 3200, style: { borderRadius: "16px", background: "#071a2c", color: "#fff", boxShadow: "0 20px 40px rgba(7, 26, 44, 0.24)" } }} />
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
