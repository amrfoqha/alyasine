import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

const DeleteButton = ({ handleDelete }) => {
  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-semibold shadow-sm cursor-pointer"
    >
      <DeleteIcon fontSize="small" />
      حذف
    </button>
  );
};

export default DeleteButton;
