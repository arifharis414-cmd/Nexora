import api from "./api";

export const getProductReviews = (productId) => api.get(`/reviews/${productId}`).then((r) => r.data);
export const createReview = (productId, data) => api.post(`/reviews/${productId}`, data).then((r) => r.data);
