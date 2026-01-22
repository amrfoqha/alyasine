import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import { Add, People } from "@mui/icons-material";
import ButtonComponent from "../components/ButtonComponent";
import AddInvoiceDialog from "../components/AddInvoiceDialog";
import InvoiceTable from "../components/InvoiceTable";
import UsePagination from "../context/usePagination";
import { getInvoices } from "../API/InvoiceAPI";
import SearchBox from "../components/SearchBox";
import { getAllCustomers } from "../API/CustomerAPI";

const InvoicePage = () => {
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices(page, limit, search);
        console.log(response);
        setInvoices(response.invoices);
        setInvoicesCount(response.totalInvoices);
        setTotalPages(response.pagination.totalPages);

        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, [page, limit, search]);

  return (
    <div className="bg-gray-50/50 min-h-screen w-full" dir="rtl">
      <Header title="الفواتير" />
      <main className="md:p-8 w-full mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          <DashboardCard
            title="إجمالي الفواتير"
            value={invoicesCount}
            icon={<People color="primary" style={{ fontSize: 60 }} />}
            color="blue"
          />
          <DashboardCard
            title="إضافة فاتورة جديدة"
            icon={<Add color="primary" style={{ fontSize: 40 }} />}
            color="blue"
          >
            <ButtonComponent
              type="button"
              onClick={() => setOpen(true)}
              label={
                <>
                  إضافة فاتورة جديدة <Add />
                </>
              }
              color="primary"
              className="text-lg font-bold"
            />
          </DashboardCard>
        </section>

        <AddInvoiceDialog
          open={open}
          setOpen={setOpen}
          setInvoices={setInvoices}
          customers={customers}
          setInvoicesCount={setInvoicesCount}
        />

        <section className="flex flex-col justify-start bg-white px-8 pt-8 rounded-2xl shadow-xl border border-gray-100 mb-6 gap-4 items-center mt-2">
          <div className="p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center w-full">
            <SearchBox
              onChange={handleSearch}
              placeholder="ابحث باسم الزبون..."
            />
          </div>

          <InvoiceTable invoices={invoices} setInvoices={setInvoices} />

          <UsePagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </section>
      </main>
    </div>
  );
};

export default InvoicePage;
