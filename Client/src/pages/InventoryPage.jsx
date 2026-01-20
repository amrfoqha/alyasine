import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAllProductCategory } from "../API/ProductCategoryAPI";
import CategoryCard from "../components/CategoryCard";
import AddCategoryForm from "../components/AddCategoryForm";
import { motion } from "framer-motion";
import UsePagination from "../context/UsePagination";
import { Label, LabelImportant } from "@mui/icons-material";
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
    <div className="flex flex-col gap-2  mx-auto  w-full">
      <Header title="المستودع" />
      <main className="flex flex-col gap-2 items-center w-full">
        <motion.section
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col mt-2 border-b-2 border-gray-200 w-full pb-5"
        >
          <h1 className="text-center text-3xl py-4">
            <span>إضافة</span>
            <span className="text-red-600">منتج جديد</span>
          </h1>

          <AddCategoryForm setProducts={setProducts} products={products} />
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col mt-4 w-3/4"
        >
          <div className="flex justify-center w-full">
            <h1 className="text-center text-2xl py-4 text-gray-500">
              لإضافة منتج جديد إضغط على الفئة الخاصة بالمنتج
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 ">
            {products.map((product, idx) => (
              <CategoryCard product={product} key={idx} />
            ))}
          </div>
          <div className="flex justify-center">
            <UsePagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default InventoryPage;
