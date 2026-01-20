import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import { Add, AddAPhoto, Man, People } from "@mui/icons-material";
import { Typography } from "@mui/material";
import ButtonComponent from "../components/ButtonComponent";
import SearchBox from "../components/SearchBox";
import CustomerTable from "../components/CustomerTable";
import UsePagination from "../context/UsePagination";
import AddCustomerDialog from "../components/AddCustomerDialog";
import { getCustomers } from "../API/CustomerAPI";

const CustomerPage = () => {
  const [Page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers(Page, limit, search);
        setCustomers(response.customers);
        setTotalPages(response.pagination.totalPages);
        setCustomersCount(response.pagination.customersCount);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, [Page, limit, search]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
    setPage(1);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen w-full" dir="rtl">
      <Header title="العملاء" />
      <main className="md:p-8 w-full mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 ">
          <DashboardCard
            title="إجمالي العملاء"
            value={customersCount}
            icon={<People color="primary" size={100} />}
            color="blue"
          />
          <DashboardCard
            title="إضافة عميل جديد"
            icon={<Add color="primary" style={{ fontSize: 40 }} />}
            color="blue"
          >
            <ButtonComponent
              type="button"
              onClick={() => setOpen(true)}
              label={
                <>
                  إضافة عميل جديد <Add />
                </>
              }
              color="primary"
              className={"text-lg font-bold"}
            />
          </DashboardCard>
        </section>
        <AddCustomerDialog
          open={open}
          setOpen={setOpen}
          setCustomers={setCustomers}
        />
        <section className="flex flex-col justify-start bg-white px-8 pt-8 rounded-2xl shadow-xl border border-gray-100 mb-6  gap-4 items-center mt-2">
          <div className="p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center w-full">
            <SearchBox onChange={handleSearch} />
          </div>
          <CustomerTable customers={customers} setCustomers={setCustomers} />
          <UsePagination
            Page={Page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </section>
      </main>
    </div>
  );
};

export default CustomerPage;
