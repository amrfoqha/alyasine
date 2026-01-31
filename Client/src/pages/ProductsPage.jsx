import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getProductCategoryById } from "../API/ProductCategoryAPI";
import BackButton from "../components/BackButton";
import ProductsTable from "../components/ProductsTable";
import { getAllProductsByCategoryByPage } from "../API/ProductAPI";
import UsePagination from "../context/UsePagination";
import { motion } from "framer-motion";
import AddProductDialog from "../components/AddProductDialog";
import { Button, Stack, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchBox from "../components/SearchBox";
import { toast } from "react-hot-toast";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CategoryIcon from "@mui/icons-material/Category";

const ProductsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productCategory, setProductCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const limit = 5;

  useEffect(() => {
    const fetchProductCategoryById = async () => {
      try {
        const categoryData = await getProductCategoryById(id);
        setProductCategory(categoryData);

        const res = await getAllProductsByCategoryByPage(
          id,
          page,
          limit,
          search,
        );
        setProducts(res.products);
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
      } catch (error) {
        toast.error("حدث خطأ أثناء جلب المنتجات");
        navigate("/inventory");
      }
    };
    fetchProductCategoryById();
  }, [id, page, search, navigate]);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setPage(1);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full pb-10 font-sans" dir="rtl">
      <Header title="تصفح المنتجات" />

      {/* منطقة العرض العلوية (Hero Section) */}
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Box className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <CategoryIcon fontSize="medium" />
            </div>
            <div>
              <Typography
                variant="caption"
                className="text-gray-400 font-bold block"
              >
                الفئة المختارة
              </Typography>
              <Typography variant="h6" className="font-black text-gray-800">
                {productCategory.name}
              </Typography>
            </div>
          </Box>

          <Box className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <CalendarMonthIcon fontSize="medium" />
            </div>
            <div>
              <Typography
                variant="caption"
                className="text-gray-400 font-bold block"
              >
                تاريخ الإنشاء
              </Typography>
              <Typography
                variant="h6"
                className="font-bold text-gray-800 font-mono"
              >
                {productCategory.createdAt?.split("T")[0]}
              </Typography>
            </div>
          </Box>
        </div>

        <div className="hover:scale-105 transition-transform">
          <BackButton />
        </div>
      </motion.main>

      {/* شريط الأدوات الذكي (Toolbar) */}
      <section className="max-w-7xl mx-auto px-8 mb-8">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50"
        >
          <div className="w-full md:w-1/2">
            <SearchBox
              onChange={handleSearch}
              placeholder="بحث سريع في هذه الفئة..."
            />
          </div>

          <Button
            variant="contained"
            startIcon={<AddIcon className="ml-2" />}
            onClick={() => setOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              px: 4,
              py: 1.5,
              borderRadius: "18px",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 10px 15px -3px rgba(30, 41, 59, 0.3)",
              "&:hover": { background: "#0f172a" },
            }}
          >
            إضافة منتج جديد
          </Button>
        </Stack>
      </section>

      {/* جدول المنتجات */}
      <section className="max-w-7xl mx-auto px-8">
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-2">
              <ProductsTable products={products} setProducts={setProducts} />
            </div>

            <div className="py-8 flex justify-center border-t border-gray-50">
              <UsePagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </motion.div>
        ) : (
          <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[3rem] py-20 flex flex-col items-center">
            <span className="text-6xl mb-4 opacity-20">🛒</span>
            <Typography className="text-gray-400 font-bold">
              لا توجد منتجات مضافة في هذه الفئة بعد
            </Typography>
          </div>
        )}
      </section>

      <AddProductDialog
        open={open}
        setOpen={setOpen}
        onAdd={() => setOpen(false)}
        productCategory={productCategory}
        setProducts={setProducts}
      />
    </div>
  );
};

export default ProductsPage;
