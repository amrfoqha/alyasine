import React, { useState } from "react";
import { RegisterAPI } from "../API/AuthAPI";
import { useContext } from "react";
import { Auth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

const RegFrom = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    nameError: "",
    passwordError: "",
    confirmPasswordError: "",
  });
  const { register } = useContext(Auth);

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
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError({
      ...error,
      confirmPasswordError:
        e.target.value.length < 3
          ? "الباسورد يجب ان يكون 3 حروف على الاقل"
          : password !== e.target.value
            ? "الباسورد غير مطابق"
            : "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      error.nameError ||
      error.passwordError ||
      error.confirmPasswordError ||
      !name ||
      !password ||
      !confirmPassword
    ) {
      return;
    }
    try {
      const response = await register(name, password, confirmPassword);
      setName("");
      setPassword("");
      setConfirmPassword("");
      setError({
        nameError: "",
        passwordError: "",
        confirmPasswordError: "",
      });
      if (response.success) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-12 pb-4 border border-gray-300 rounded  md:w-1/3 w-full"
    >
      <h1 className="md:text-3xl text-center text-lg ">تسجيل حساب جديد</h1>
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
            value={name}
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
            type="password"
            placeholder="password"
            id="password"
            className="p-2 border border-gray-300 rounded"
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        {error.passwordError && (
          <p className="text-red-500">{error.passwordError}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg md:text-xl text-end">
            تاكيد كلمة المرور
          </label>
          <input
            type="password"
            placeholder="password"
            id="passwordConfirm"
            className="p-2 border border-gray-300 rounded"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
          />
        </div>
        {error.confirmPasswordError && (
          <p className="text-red-500">{error.confirmPasswordError}</p>
        )}
      </div>
      <button className="bg-blue-500 text-white p-1 text-lg md:p-4  md:text-xl rounded md:w-full   w-full self-center hover:bg-blue-600 hover:cursor-pointer">
        إنشاء حساب
      </button>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          className=" text-blue-500 text-lg md:px-4  md:text-xl rounded md:w-full   w-full self-center hover:underline hover:cursor-pointer"
        >
          لديك حساب؟
        </button>
      </div>
    </form>
  );
};

export default RegFrom;
