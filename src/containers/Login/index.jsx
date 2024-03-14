import React, { useEffect, useState } from "react";
import { EncryptStorage } from "encrypt-storage";
import { useNavigate } from "react-router-dom";

import LoginPage from "components/Login/LoginForm";
import ResetPasswordPage from "components/Login/Verification";
import OTPScreenPage from "components/Login/OTPScreen";
import UpdatePasswordPage from "components/Login/UpdatePassword";
import { resetPassword } from "services/login";
import { toast } from "react-toastify";

import LoginWelcome from "components/LoginWelcome";

import { getWindowWidth } from "utils/window";

import "react-toastify/dist/ReactToastify.css";
import "containers/Login/login.scss";

const Login = () => {
  const [currentPage, setCurrentPage] = useState("LOGIN");
  const [verificationToken, setVerificationToken] = useState(null);
  const [OTPVerifyToken, setOTPVerifyToken] = useState(null);
  const [emailVerifyToken, setEmailVerifyToken] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleBackToLogin = () => {
    setCurrentPage("LOGIN");
  };

  const navigate = useNavigate();

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const isAuth = encryptStorage?.getItem("authToken");

  /**
   * useEffect hook that redirects the user to the dashboard page if they are authenticated.
   */
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth]);

  /**
   * Sends an OTP (One-Time Password) for password reset to the user's email address.
   */
  const sendOtp = async () => {
    setOtpLoading(true);

    const response = await resetPassword(emailVerifyToken);

    if (response?.token) {
      setVerificationToken(response?.token);
    } else {
      toast.error(response?.err_msg, {
        position:
          getWindowWidth() <= 768
            ? toast.POSITION.BOTTOM_CENTER
            : toast.POSITION.TOP_RIGHT
      });
    }

    setOtpLoading(false);
  };

  return (
    <section className="form">
      <div className="formData containerData">
        <div className="formImage">
          <LoginWelcome />
        </div>

        <div className="formField formFieldData">
          {currentPage === "LOGIN" && (
            <LoginPage
              resetPassword={() => setCurrentPage("RESET_PASSWORD")}
              onBackClick={handleBackToLogin}
              getWindowWidth={getWindowWidth}
            />
          )}

          {currentPage === "RESET_PASSWORD" && (
            <ResetPasswordPage
              onBackClick={handleBackToLogin}
              setCurrentPage={setCurrentPage}
              setVerificationToken={setVerificationToken}
              setEmailVerifyToken={setEmailVerifyToken}
              getWindowWidth={getWindowWidth}
            />
          )}

          {currentPage === "OTP_SCREEN" && (
            <OTPScreenPage
              verificationSuccess={() => setCurrentPage("UPDATE_PASSWORD")}
              onBackClick={handleBackToLogin}
              verificationToken={verificationToken}
              emailVerifyToken={emailVerifyToken}
              getWindowWidth={getWindowWidth}
              setOTPVerifyToken={setOTPVerifyToken}
              resendOtp={sendOtp}
              otpLoading={otpLoading}
            />
          )}

          {currentPage === "UPDATE_PASSWORD" && (
            <UpdatePasswordPage
              getWindowWidth={getWindowWidth}
              emailVerifyToken={emailVerifyToken}
              OTPVerifyToken={OTPVerifyToken}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;
