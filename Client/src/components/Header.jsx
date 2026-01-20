import React from "react";

const Header = ({ title }) => {
  return (
    <header className="flex justify-center items-center w-full bg-gray-900/90 p-5 shadow-lg border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg">
      <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-200/90 to-blue-200/90 bg-clip-text text-transparent">
        {title}
      </h1>
    </header>
  );
};

export default Header;
