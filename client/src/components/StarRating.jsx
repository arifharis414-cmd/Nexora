import { FaStar, FaRegStar } from "react-icons/fa";

// Renders 5 stars, filling in `rating` of them
export default function StarRating({ rating = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating) ? (
          <FaStar key={i} size={size} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} size={size} className="text-gray-300" />
        )
      )}
    </div>
  );
}
