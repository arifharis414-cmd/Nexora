// Shown while products are loading — mimics the shape of a real ProductCard
export default function ProductCardSkeleton() {
  return (
    <div className="skeleton-shine rounded-2xl border border-gray-100 p-3 animate-pulse">
      <div className="bg-gray-200 rounded-xl aspect-square mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
