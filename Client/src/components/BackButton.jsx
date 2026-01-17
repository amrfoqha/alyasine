import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="text-blue-700 p-2 rounded-md hover:text-blue-400  text-2xl flex  gap-2 cursor-pointer"
      onClick={() => navigate(-1)}
    >
      <ArrowLeftIcon className="w-6 h-6 mt-2 " />
      رجوع
    </button>
  );
};

export default BackButton;
