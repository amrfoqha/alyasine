import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const CategoryCard = ({ product }) => {
  const navigate = useNavigate();
  // Safety check to prevent crashes
  if (!product) return null;

  // Formatting the date nicely
  const formattedDate = new Date(product.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col justify-between bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full">
        <div>
          <img
            src="https://img.freepik.com/premium-photo/full-frame-shot-rocks-tiled-floor_1048944-29853050.jpg?semt=ais_hybrid&w=740&q=80"
            alt="category image"
            className="w-full h-32 object-cover rounded-t-xl"
          />
        </div>

        <div className="mt-2 px-2">
          <h3 className="text-xl font-bold text-gray-800 capitalize">
            {product.name}
          </h3>
          <p className="text-md text-gray-500 mt-1 text-center">
            {formattedDate} : في تاريخ
          </p>
        </div>
      </div>

      {/* Optional: Add a small decorative element or tag */}
      <div className="mt-2 flex items-center gap-2 p-5">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="text-lg uppercase font-semibold text-gray-500 tracking-wider">
          Active Category
        </span>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
