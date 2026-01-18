import React, { useState } from "react";
import ButtonComponent from "../components/ButtonComponent";
import { deleteProduct } from "../API/ProductAPI";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete"; // أضف أيقونات لمظهر احترافي
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddStockDialog from "./AddStockDialog";

const ProductsTable = ({ products, setProducts }) => {
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.log(error);
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
      className="mx-auto mt-10 w-full overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 px-2 h-100"
    >
      <AddStockDialog
        open={openAddStockDialog}
        setOpen={setOpenAddStockDialog}
        onAdd={() => setOpenAddStockDialog(false)}
        product={product}
      />
      <table className="w-full text-center" dir="rtl">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 text-gray-600 font-bold">اسم المنتج</th>
            <th className="p-4 text-gray-600 font-bold">السعر</th>
            <th className="p-4 text-gray-600 font-bold">الوحدة</th>
            <th className="p-4 text-gray-600 font-bold">الوصف</th>
            <th className="p-4 text-gray-600 font-bold">الخصائص</th>
            <th className="p-4 text-gray-600 font-bold">التصنيف</th>
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
              <td className="p-4 font-medium text-gray-800">{product.name}</td>
              <td className="p-4 text-blue-600 font-bold">
                {product.sellPrice} $
              </td>
              <td className="p-4 text-gray-500">{product.unit}</td>
              <td className="p-4 text-gray-500 max-w-xs truncate">
                {product.description}
              </td>
              <td className="p-4">
                {Object.entries(product.attributes).length > 0 ? (
                  Object.entries(product.attributes).map(
                    ([key, value], index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full ml-1 mb-1"
                      >
                        {key}: {value}
                      </span>
                    ),
                  )
                ) : (
                  <span className="text-gray-300">لا يوجد</span>
                )}
              </td>
              <td className="p-4">
                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm">
                  {product.category?.name}
                </span>
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenAddStockDialog(product)}
                    className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 text-sm font-semibold shadow-sm"
                  >
                    <AddBoxIcon fontSize="small" />
                    مخزون
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-semibold shadow-sm"
                  >
                    <DeleteIcon fontSize="small" />
                    حذف
                  </button>
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
