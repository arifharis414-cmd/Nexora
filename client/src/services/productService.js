import api from "./api";

export const getProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const getFeaturedProducts = () => api.get("/products/featured").then((r) => r.data);
export const getProductBySlug = (slug) => api.get(`/products/${slug}`).then((r) => r.data);
