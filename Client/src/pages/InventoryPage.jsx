import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAllProductCategory } from "../API/ProductCategoryAPI";
import CategoryCard from "../components/CategoryCard";
import AddCategoryForm from "../components/AddCategoryForm";
import { motion } from "framer-motion";
import UsePagination from "../context/UsePagination";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 3;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductCategory(page, limit);
        setProducts(response.productCategories);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [page, limit]);

  return (
    <div
      className="min-h-screen bg-[#fcfcfc] flex flex-col w-full font-sans"
      dir="rtl"
    >
      {/* هيدر الصفحة الرئيسي */}
      <Header title="إدارة المستودع" />

      <main className="container mx-auto px-4 py-6 flex flex-col gap-8 items-center w-full">
        {/* قسم إضافة فئة جديدة */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-50"
        >
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-black text-gray-800 flex gap-2">
              <span>إضافة</span>
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
                فئة منتجات
              </span>
              <span className="text-gray-400">جديدة</span>
            </h1>
            <p className="text-gray-400 mt-3 text-sm">
              قم بتنظيم مستودعك عن طريق إضافة تصنيفات واضحة
            </p>
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-2">
            <AddCategoryForm setProducts={setProducts} products={products} />
          </div>
        </motion.section>

        <hr className="w-full max-w-5xl border-gray-100" />

        {/* قسم عرض الفئات الحالية */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col w-full max-w-6xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 gap-4">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">تصفح الفئات</h2>
              <p className="text-blue-500 font-medium mt-1 text-sm">
                إضغط على الفئة لإضافة منتجات بداخلها
              </p>
            </div>

            {/* مؤشر الصفحة الحالي */}
            <div className="bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-xs font-bold text-gray-500">
              صفحة {page} من {totalPages}
            </div>
          </div>

          {/* شبكة عرض الفئات */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
              {products.map((product, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="transition-all duration-300"
                >
                  <CategoryCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <span className="text-5xl mb-4">📦</span>
              <h3 className="text-gray-400 font-bold">
                لا يوجد فئات مضافة حالياً
              </h3>
            </div>
          )}

          {/* الترقيم */}
          <div className="mt-12 flex justify-center bg-white py-4 rounded-2xl shadow-sm border border-gray-50 w-fit mx-auto px-8">
            <UsePagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </motion.section>
      </main>

      {/* لمسة جمالية في الأسفل */}
      <footer className="py-10 text-center text-gray-300 text-xs">
        نظام إدارة المستودع الذكي &copy; 2024
      </footer>
    </div>
  );
};

export default InventoryPage;
