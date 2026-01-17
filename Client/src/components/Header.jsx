import React from "react";

const Header = ({ title }) => {
  return (
    <header className="flex justify-center w-full bg-blue-800">
      <h1 className="text-3xl py-4 text-white">{title}</h1>
    </header>
  );
};

export default Header;
