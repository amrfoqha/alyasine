import React, { useState } from "react";
import ButtonComponent from "../components/ButtonComponent";
import { deleteProduct } from "../API/ProductAPI";
import { motion } from "framer-motion";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddStockDialog from "./AddStockDialog";
import { toast } from "react-hot-toast";
import DeleteButton from "./DeleteButton";

const ProductsTable = ({ products, setProducts }) => {
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product._id !== id));
        toast.success("تم حذف المنتج بنجاح");
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء حذف المنتج");
      }
    }
  };

  const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
  const [product, setProduct] = useState(null);

  const handleOpenAddStockDialog = (product) => {
    setProduct(product);
    setOpenAddStockDialog(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // أضفنا خلفية بيضاء، ظل خفيف، وزوايا مستديرة للحاوية
      className="mx-auto mt-10 w-full overflow-x-auto rounded-xl bg-white shadow-lg border border-gray-100  h-auto"
    >
      <AddStockDialog
        open={openAddStockDialog}
        setOpen={setOpenAddStockDialog}
        onAdd={() => setOpenAddStockDialog(false)}
        product={product}
        setProducts={setProducts}
      />
      <table className="w-full text-center" dir="rtl">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 text-gray-600 font-bold">اسم المنتج</th>
            <th className="p-4 text-gray-600 font-bold">السعر</th>
            <th className="p-4 text-gray-600 font-bold">الوصف</th>
            <th className="p-4 text-gray-600 font-bold">الخصائص</th>
            <th className="p-4 text-gray-600 font-bold">التصنيف</th>
            <th className="p-4 text-gray-600 font-bold">الكمية الحالية</th>
            <th className="p-4 text-gray-600 font-bold">الوحدة</th>
            <th className="p-4 text-gray-600 font-bold text-center">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => (
            <tr
              key={product._id}
              className="hover:bg-blue-50/30 transition-colors duration-200"
            >
              <td className="p-4 font-medium text-gray-800 w-auto">
                {product.name}
              </td>
              <td className="p-4 text-blue-600 font-bold w-auto">
                {product.sellPrice} $
              </td>

              <td className="p-4 text-gray-500 max-w-xs truncate w-auto">
                {product.description}
              </td>
              <td className="p-2 flex flex-col gap-2 w-auto">
                {Object.entries(product.attributes).length > 0 ? (
                  Object.entries(product.attributes).map(
                    ([key, value], index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-600 text-xs px-1 py-1 rounded-2xl ml-1 mb-1  w-full"
                      >
                        {key}: {value}
                      </span>
                    ),
                  )
                ) : (
                  <span className="text-gray-300">لا يوجد</span>
                )}
              </td>
              <td className="p-4 w-auto">
                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm">
                  {product.category?.name}
                </span>
              </td>
              <td className="p-4 w-auto">
                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm">
                  {product.quantity}
                </span>
              </td>
              <td className="p-4 text-gray-500 w-auto">{product.unit}</td>
              <td className="p-4 w-auto">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenAddStockDialog(product)}
                    className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 text-sm font-semibold shadow-sm"
                  >
                    <AddBoxIcon fontSize="small" />
                    مخزون
                  </button>
                  <DeleteButton
                    handleDelete={() => handleDelete(product._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsTable;
