import React from "react";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { TextField, InputAdornment } from "@mui/material";
import { SearchIcon } from "lucide-react";

const SearchBox = ({ onChange, placeholder }) => {
  return (
    <TextField
      placeholder={`${placeholder || "ابحث باسم المنتج..."}`}
      variant="outlined"
      size="small"
      fullWidth
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="black" />
          </InputAdornment>
        ),
      }}
      sx={{ maxWidth: 400 }}
    />
  );
};

export default SearchBox;
