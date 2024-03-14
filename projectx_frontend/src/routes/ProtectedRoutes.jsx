import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";
import Login from "containers/Login";

const ProtectedRoutes = () => {
  const navigate = useNavigate();

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const isAuth = encryptStorage?.getItem("authToken");

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  return isAuth ? <Outlet /> : <Login />;
};

export default ProtectedRoutes;
