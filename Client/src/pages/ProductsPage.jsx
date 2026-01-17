import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getProductCategoryById } from "../API/ProductCategoryAPI";
import AddProductForm from "../components/AddProductForm";
import BackButton from "../components/BackButton";
import ProductsTable from "../components/ProductsTable";
const ProductsPage = () => {
  const { id } = useParams();
  const [productCategory, setProductCategory] = useState({});
  const [products, setProducts] = useState([]);
  console.log(id);
  useEffect(() => {
    const fetchProductCategoryById = async () => {
      try {
        const productCategory = await getProductCategoryById(id);
        setProductCategory(productCategory);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductCategoryById();
  }, [id]);

  return (
    <div className="flex flex-col gap-4  mx-auto  w-full">
      <Header title="المنتجات" />
      <main className="flex flex-row-reverse gap-4 items-center mx-auto  w-full">
        <div className="flex flex-row-reverse gap-10 justify-center mx-auto  w-full">
          <h1 className="text-center text-2xl py-4">
            <span className="text-red-600 text-3xl"> الفئة: </span>
            <span className="text-gray-600 underline underline-offset-6">
              {productCategory.name}
            </span>
          </h1>
          <h1 className="text-center text-2xl py-4">
            <span className="text-red-600 text-3xl"> تاريخ الإضافة: </span>
            <span className="text-gray-600 underline underline-offset-6">
              {productCategory.createdAt?.split("T")[0]}
            </span>
          </h1>
        </div>
        <div className=" pl-10">
          <BackButton />
        </div>
      </main>
      <section>
        <AddProductForm
          productCategory={productCategory}
          setProducts={setProducts}
        />
      </section>
      <section>
        <ProductsTable products={products} />
      </section>
    </div>
  );
};

export default ProductsPage;
