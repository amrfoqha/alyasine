import React, { useContext, useState } from "react";
import { LoginAPI } from "../API/AuthAPI";
import { Auth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginFrom = ({ setShowLogin = () => {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ nameError: "", passwordError: "" });
  const { login } = useContext(Auth);
  const redirect = useNavigate();
  const handleNameChange = (e) => {
    setName(e.target.value);
    setError({
      ...error,
      nameError:
        e.target.value.length < 3 ? "الاسم يجب ان يكون 3 حروف على الاقل" : "",
    });
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError({
      ...error,
      passwordError:
        e.target.value.length < 3
          ? "الباسورد يجب ان يكون 3 حروف على الاقل"
          : "",
    });
  };
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error.nameError || error.passwordError || !name || !password) {
      return;
    }
    try {
      const response = await login(name, password);

      setError({
        nameError: "",
        passwordError: "",
      });
      if (response.success) {
        redirect("/");
        setName("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error?.message || "فشل تسجيل الدخول");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-12 pb-4 border border-gray-300 rounded  md:w-1/3 w-full"
    >
      <h1 className="md:text-3xl text-center text-lg ">تسجيل الدخول</h1>
      <div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg md:text-xl text-end">
            إسم المستخدم
          </label>
          <input
            type="text"
            placeholder="name"
            className="p-2 border border-gray-300 rounded"
            onChange={handleNameChange}
          />
        </div>
        {error.nameError && <p className="text-red-500">{error.nameError}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg md:text-xl text-end">
            كلمة المرور
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            id="password"
            className="p-2 border border-gray-300 rounded"
            onChange={handlePasswordChange}
          />
        </div>
        {error.passwordError && (
          <p className="text-red-500">{error.passwordError}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={togglePassword}
            checked={showPassword}
            id="showPassword"
          />
          <label htmlFor="showPassword" className="text-lg text-end ">
            عرض كلمة المرور
          </label>
        </div>
      </div>
      <button className="bg-blue-500 text-white p-1 text-lg md:p-4  md:text-xl rounded md:w-full   w-full self-center hover:bg-blue-600 hover:cursor-pointer">
        تسجيل الدخول
      </button>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowLogin(false)}
          className=" text-blue-500 text-lg md:px-4  md:text-xl rounded md:w-full   w-full self-center hover:underline hover:cursor-pointer"
        >
          انشئ حساب جديد
        </button>
      </div>
    </form>
  );
};

export default LoginFrom;
