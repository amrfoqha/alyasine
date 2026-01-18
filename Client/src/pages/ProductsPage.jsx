import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getProductCategoryById } from "../API/ProductCategoryAPI";
import AddProductForm from "../components/AddProductForm";
import BackButton from "../components/BackButton";
import ProductsTable from "../components/ProductsTable";
import { getAllProductsByCategoryByPage } from "../API/ProductAPI";
import UsePagination from "../context/UsePagination";
import { motion } from "framer-motion";
import AddProductDialog from "../components/AddProductDialog";
import ButtonComponent from "../components/ButtonComponent";
import SearchBox from "../components/SearchBox";
import { TextField, InputAdornment, Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddStockDialog from "../components/AddStockDialog";
const ProductsPage = () => {
  const { id } = useParams();
  const [productCategory, setProductCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const limit = 5;
  console.log(id);
  useEffect(() => {
    const fetchProductCategoryById = async () => {
      try {
        const productCategory = await getProductCategoryById(id);
        setProductCategory(productCategory);
        const res = await getAllProductsByCategoryByPage(id, page, limit);
        console.log(res);
        setProducts(res.products);
        setAllProducts(res.products);
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductCategoryById();
  }, [id, page]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setProducts(allProducts);
      return;
    }
    const filteredProducts = allProducts.filter((product) => {
      return product.name.toLowerCase().includes(searchValue);
    });
    setProducts(filteredProducts);
  };
  return (
    <div className="flex flex-col gap-4  mx-auto  w-full">
      <Header title="المنتجات" />
      <motion.main
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
        className="flex flex-row-reverse gap-4 items-center mx-auto  w-full"
      >
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
      </motion.main>
      <motion.section
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
      >
        {/* <AddProductForm
          productCategory={productCategory}
          setProducts={setProducts}
        /> */}
        <AddProductDialog
          open={open}
          setOpen={setOpen}
          onAdd={() => setOpen(false)}
          productCategory={productCategory}
          setProducts={setProducts}
        />
      </motion.section>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3, backgroundColor: "#f8f9fa", p: 2, borderRadius: "15px" }}
      >
        {/* خانة البحث */}
        <TextField
          placeholder="ابحث عن منتج..."
          onChange={handleSearch}
          size="small"
          sx={{ width: "300px", backgroundColor: "white", direction: "rtl" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* زر فتح الـ Dialog */}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(135deg, #1E2939, #193CB8)",
            px: 3,
            py: 1,
            borderRadius: "10px",
            fontSize: "16px",
            color: "white",
          }}
        >
          إضافة منتج جديد
        </Button>
      </Stack>

      {products.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 justify-center items-center"
        >
          <ProductsTable products={products} setProducts={setProducts} />
          <UsePagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </motion.section>
      )}
    </div>
  );
};

export default ProductsPage;
