import React from "react";
import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../components/ButtonComponent";
import Header from "../components/Header";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[80vh] w-full bg-gray-50" dir="rtl">
      <Header title="الصفحة غير موجودة" />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <FileQuestion className="w-32 h-32 text-blue-600 relative z-10" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold text-gray-900 mb-2 font-mono"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            الصفحة غير موجودة
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 max-w-md mb-8"
          >
            عذراً، الصفحة التي تحاول الوصول إليها قد تكون حذفت أو تم تغيير اسمها
            أو هي غير متاحة حالياً.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ButtonComponent
              label="العودة للرئيسية"
              onClick={() => navigate("/")}
              className="px-8 py-3 text-lg shadow-lg hover:shadow-blue-200 transition-shadow duration-300"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
