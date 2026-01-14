import React, { useEffect, useState } from "react";
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/ButtonComponent";
import {
  createProductCategory,
  getProductCategory,
} from "../API/ProductCategoryAPI";
import CategoryCard from "../components/CategoryCard";
const InventoryPage = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [products, setProducts] = useState([]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const product = await createProductCategory(name);
      setProducts([...products, product]);
    } catch (error) {
      setNameError(error.message);
      console.log(error.message);
    }
  };
  const handleChange = (e) => {
    setName(e.target.value);
    setNameError(e.target.value.length < 1 ? "الاسم يجب ان يحتوي على حرف" : "");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProductCategory();
        setProducts(products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="flex flex-col gap-4  mx-auto  w-full">
      <header className="flex justify-center w-full bg-blue-800">
        <h1 className="text-3xl py-4 text-white">المستودع</h1>
      </header>
      <main className="flex flex-col gap-4 items-center w-full">
        <section className="flex flex-col mt-4 border-b-2 border-gray-200 w-full pb-5">
          <h1 className="text-center text-3xl py-4">
            <span>إضافة</span>
            <span className="text-red-600">منتج جديد</span>
          </h1>

          <form action="" className="flex flex-row-reverse gap-4 mt-10 mx-auto">
            <div>
              <InputComponent
                label="اسم المنتج"
                type="text"
                onChange={handleChange}
                name="name"
              />
              {nameError && (
                <p className="text-red-500  mb-1 text-sm">{nameError}</p>
              )}
            </div>
            <ButtonComponent
              label="إضافة"
              onClick={handleAddProduct}
              className={"self-start"}
            />
          </form>
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
