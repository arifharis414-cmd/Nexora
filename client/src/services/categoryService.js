import api from "./api";

export const getCategories = () => api.get("/categories").then((r) => r.data);
export const getCategoryBySlug = (slug) => api.get(`/categories/${slug}`).then((r) => r.data);
