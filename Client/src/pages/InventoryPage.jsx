import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAllProductCategory } from "../API/ProductCategoryAPI";
import CategoryCard from "../components/CategoryCard";
import AddCategoryForm from "../components/AddCategoryForm";
const InventoryPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProductCategory();
        setProducts(products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="flex flex-col gap-4  mx-auto  w-full">
      <Header title="المستودع" />
      <main className="flex flex-col gap-4 items-center w-full">
        <section className="flex flex-col mt-4 border-b-2 border-gray-200 w-full pb-5">
          <h1 className="text-center text-3xl py-4">
            <span>إضافة</span>
            <span className="text-red-600">منتج جديد</span>
          </h1>

          <AddCategoryForm setProducts={setProducts} products={products} />
        </section>
        <section className="flex flex-col mt-4 w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 ">
            {products.map((product, idx) => (
              <CategoryCard product={product} key={idx} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default InventoryPage;
