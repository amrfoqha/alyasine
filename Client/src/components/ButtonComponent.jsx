import React from "react";
import { motion } from "framer-motion";

const ButtonComponent = ({
  label,
  className,
  onClick,
  type = "button",
  disabled = false,
  icon,
  children,
}) => {
  const baseStyles =
    "relative flex items-center justify-center gap-2 px-6 py-2.5 font-bold transition-all duration-300 rounded-xl overflow-hidden shadow-md active:scale-95";

  const activeStyles = disabled
    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 cursor-pointer";

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${activeStyles} ${className}`}
      onClick={!disabled ? onClick : undefined}
      type={type}
      disabled={disabled}
    >
      {/* طبقة لمعان خفيفة عند الحوم فوق الزر */}
      {!disabled && (
        <span className="absolute inset-0 w-full h-full bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full hover:animate-[shimmer_1.5s_infinite]"></span>
      )}

      {icon && <span className="text-xl">{icon}</span>}
      <span className="tracking-wide text-sm md:text-base leading-none">
        {label}
      </span>
      {children}
    </motion.button>
  );
};

export default ButtonComponent;
