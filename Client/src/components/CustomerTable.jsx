import { Edit2 } from "lucide-react";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import { deleteCustomer } from "../API/CustomerAPI";
import { toast } from "react-hot-toast";
import EditCustomerDialog from "./EditCustomerDialog";
import { useNavigate } from "react-router-dom";

const CustomerTable = ({ customers, setCustomers }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((cust) => cust?._id !== id));
      toast.success("تم حذف العميل بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف العميل");
    }
  };
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-x-auto border border-gray-100 w-full"
      dir="rtl"
    >
      <EditCustomerDialog
        open={open}
        setOpen={setOpen}
        customer={customer}
        setCustomer={setCustomer}
        setCustomers={setCustomers}
      />
      <table className="w-full text-right border-collapse">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr className="">
            <th className="p-4 text-gray-600 font-bold">العميل</th>
            <th className="p-4 text-gray-600 font-bold">رقم الهاتف</th>
            <th className="p-4 text-gray-600 font-bold">العنوان</th>
            <th className="p-4 text-gray-600 font-bold">إجمالي الطلبات</th>
            <th className="p-4 text-gray-600 font-bold">حساب الزبون</th>
            <th className="p-4 text-gray-600 font-bold text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {customers?.map((cust) => {
            if (!cust) {
              return null;
            }
            return (
              <tr
                key={cust._id}
                className="hover:bg-blue-50/30 transition-colors text-start"
              >
                <td className="p-4">
                  <div className="font-bold text-gray-800">{cust?.name}</div>
                  <div className="text-xs text-gray-500 italic">
                    كود العميل: {cust.code}
                  </div>
                </td>
                <td className="p-4 text-blue-600 font-medium font-sans">
                  {cust?.phone}
                </td>
                <td className="p-4 text-gray-600 text-sm">{cust?.address}</td>
                <td className="p-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold font-sans mr-4">
                    {cust.orders || 0}
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold mr-4    ">
                    {cust.balance} $
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setCustomer(cust);
                        setOpen(true);
                      }}
                      className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 text-sm font-semibold shadow-sm"
                    >
                      <Edit2 size={16} />
                      تعديل
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/customer/${cust._id}/statement`)
                      }
                      className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm font-semibold shadow-sm"
                    >
                      كشف حساب
                    </button>
                    <DeleteButton handleDelete={() => handleDelete(cust._id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
