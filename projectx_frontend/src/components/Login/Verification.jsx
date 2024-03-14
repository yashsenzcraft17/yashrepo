import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { resetPassword } from "services/login";

import Button from "components/Button";

import warningLogo from "assets/images/login/Warning.svg";
import companyLogo from "assets/images/login/companyLogo.svg";

const Verification = ({
  onBackClick,
  setVerificationToken,
  setEmailVerifyToken,
  getWindowWidth,
  setCurrentPage
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleEmail = (enteredEmail) => {
    setEmail(enteredEmail);
    setError("");
  };

  const validateEmail = (enteredEmail) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorMessage = !emailRegex.test(enteredEmail) ? "Invalid email Id" : "";

    if (enteredEmail.length === 0) {
      errorMessage = "Email cannot be empty";
    }
    setError(errorMessage);
    setIsButtonDisabled(!!errorMessage || enteredEmail.trim() === "");
  };

  // Handles the form submission for resetting the password.
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail(email);

    if (!isButtonDisabled) {
      setLoading(true);

      const response = await resetPassword(email);

      if (response?.token) {
        setVerificationToken(response?.token);
        setEmailVerifyToken(email);
        setCurrentPage("OTP_SCREEN");
      } else {
        toast.error(
          <>
            <span className="formAPIError">
              {response?.err_msg || "Something went wrong"}
            </span>
          </>,
          {
            position:
              getWindowWidth() <= 768
                ? toast.POSITION.BOTTOM_CENTER
                : toast.POSITION.TOP_RIGHT
          }
        );
      }

      setLoading(false);
    }
  };

  return (
    <div>
      <div className="formCompanyLogo companyLogoContainer">
        <img src={companyLogo} alt="companyLogo" />
      </div>

      <div className="verificationData">
        <h4>Want to reset your password?</h4>
        <p className="verificationDataContent">
          Please enter the email address associated with your account, and we
          will email you an OTP to reset your password.
        </p>

        <div className="formField">
          <form className="formAllField" onSubmit={handleSubmit}>
            <div className="formEmail formEmailResetPwd">
              <label>Email ID</label>
              <input
                type="email"
                name="email"
                className="formMailIcon"
                placeholder="Enter your email address"
                onBlur={() => validateEmail(email)}
                onChange={(e) => handleEmail(e.target.value)}
              />
              {error && (
                <div className="error formOTPError">
                  <img
                    className="errorImage"
                    src={warningLogo}
                    alt="warningLogo"
                  />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* <Button
                  onClick={handleSubmit}
                  className={`formButton ${
                    !email && isButtonDisabled ? "formBlurButton" : ""
                  }`}
                  disabled={isButtonDisabled}
                  type="button"
                  title="Send reset password link"
                /> */}

            <Button
              onClick={handleSubmit}
              className="formButton"
              type="button"
              disabled={loading}
            >
              {loading ? <div className="formSpinner"></div> : "Send OTP"}
            </Button>

            <Link
              className="formResetPasswordLink formLink"
              onClick={onBackClick}
            >
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;
