import { useState } from "react";
import LoginFrom from "../components/LoginFrom";
import RegFrom from "../components/RegFrom";
const LoginPage = () => {
  // const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      {/* {showLogin ? (
        <LoginFrom setShowLogin={setShowLogin} />
      ) : (
        <RegFrom setShowLogin={setShowLogin} />
      )} */}
      <LoginFrom loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default LoginPage;
