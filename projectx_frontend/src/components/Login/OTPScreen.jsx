import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { enterOTP } from "services/login";

import Button from "components/Button";

import companyLogo from "assets/images/login/companyLogo.svg";

import "react-toastify/dist/ReactToastify.css";
import "containers/Login/login.scss";

import warningLogo from "assets/images/login/Warning.svg";

const OTPScreen = ({
  onBackClick,
  verificationSuccess,
  verificationToken,
  emailVerifyToken,
  getWindowWidth,
  setOTPVerifyToken,
  resendOtp
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");

  const [resendOtpSent, setResendOtpSent] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [enableOtp, setEnableOtp] = useState(true);

  useEffect(() => {
    const storedEmail = emailVerifyToken;
    setEmailValue(storedEmail || "");
  }, []);

  const atIndex = emailValue.indexOf("@");
  const dotIndex = emailValue.lastIndexOf(".");
  const displayEmail =
    atIndex !== -1 && dotIndex > atIndex
      ? emailValue.substring(0, 2) +
        "*".repeat(atIndex - 2) +
        emailValue.substring(atIndex, atIndex + 2) +
        "*".repeat(dotIndex - (atIndex + 2)) +
        emailValue.substring(dotIndex)
      : emailValue;

  // Renders an input element with the given input properties and index.
  const renderInput = (inputProps, index) => {
    return (
      <input
        {...inputProps}
        type="number"
        className="otpScreenEnterOTP"
        key={index}
        style={{
          width: "44px",
          height: "44px",
          margin: "6px 1rem 0 0",
          fontSize: "1.4rem",
          border: `1px solid ${error ? "red" : "#ced4da"}`,
          paddingLeft: "16px",
          paddingBottom: "2px",
          WebkitAppearance: "none",
          MozAppearance: "textfield",
          appearance: "textfield",
          borderRadius: "4px"
        }}
        contentEditable
        suppressContentEditableWarning
      />
    );
  };

  /**
   * Handles the submission of the OTP form.
   * Validates the OTP entered and makes an API call to verify it.
   * Displays success or error messages based on the response.
   */
  const handleSubmit = async () => {
    if (otp?.length === 0) {
      setOtpErrorMsg("Please enter OTP");
      return;
    }

    if (otp?.length > 0 && otp.length < 6) {
      setOtpErrorMsg("Please enter full OTP");
      return;
    }

    const tokenValue = verificationToken;
    const emailValue = emailVerifyToken;

    setLoading(true);

    const response = await enterOTP(otp, tokenValue, emailValue);
    setOTPVerifyToken(response?.token);

    if (response && response.status === "1") {
      toast.success(
        <>
          <span className="formSuccessMsg">Otp verification successful</span>
        </>,
        {
          position:
            getWindowWidth() <= 768
              ? toast.POSITION.BOTTOM_CENTER
              : toast.POSITION.TOP_RIGHT,
          toastId: "1"
        }
      );

      verificationSuccess();
      setError(false);
    } else {
      toast.error(
        <>
          <span className="formErrorMsg">Incorrect OTP</span>
          <br />
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
      setError(true);
    }

    setLoading(false);
  };

  const handleResendOtp = () => {
    setResendOtpSent(true);
    setTimeLeft(120);
    resendOtp();

    setError(false);
    setOtpErrorMsg("");
  };

  useEffect(() => {
    setEnableOtp(true);
  }, []);

  //  This code section manages a countdown timer for resending OTP.
  // It activates the timer when resendOtpSent is true and timeLeft is greater than 0, decrementing timeLeft by 1 per second.
  // If the countdown reaches 0, it sets resendOtpSent to false.
  // Additionally, the timer is cleared upon the component's unmounting.
  useEffect(() => {
    let timer;

    if (resendOtpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setResendOtpSent(false);
    }

    return () => clearInterval(timer);
  }, [resendOtpSent, timeLeft]);

  return (
    <section className="otpScreen">
      <div>
        <div className="formCompanyLogo companyLogoContainer">
          <img src={companyLogo} alt="companyLogo" />
        </div>

        <div className="formAllField otpScreen">
          <div className="verificationData">
            <h4>Email Authentication</h4>
            <p className="verificationDataContent otpScreenContent">
              Please provide the verification code sent to the email id{" "}
              {displayEmail} {""}for authentication purposes.
            </p>

            <h3 className="otpScreenHeader">Enter Verification Code</h3>
            <OtpInput
              className="otpScreen"
              value={otp}
              onChange={(value) => {
                setOtpErrorMsg("");
                setOtp(value);
              }}
              numInputs={6}
              separator={<span>-</span>}
              isInputNum
              shouldAutoFocus
              inputStyle="otp-input"
              containerStyle="otp-container"
              renderInput={renderInput}
              skipDefaultStyles
            />

            {/* TODO */}
            {/* {error && (
              <div className="error formOTPError">
                <img src={warningLogo} alt="warningLogo" />
                <p>Incorrect OTP</p>
              </div>
            )} */}
            {otpErrorMsg && (
              <div className="error formOTPError">
                <img src={warningLogo} alt="warningLogo" />
                {otpErrorMsg}
              </div>
            )}
          </div>

          {enableOtp && (
            <div className="resendOtpContainer">
              {!resendOtpSent && (
                <>
                  <div className="resendOtpMessage">Did not receive OTP?</div>
                  <div className="resendBtn" onClick={handleResendOtp}>
                    Resend OTP
                  </div>
                </>
              )}

              {resendOtpSent && (
                <>
                  <div className="resendOtpMessage">
                    Time remaining: {timeLeft}s
                  </div>
                  <div className="resendDisabled">Resend OTP</div>
                </>
              )}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className={"formButton otpScreenButton"}
            disabled={loading}
            type="button"
          >
            {loading ? <div className="formSpinner"></div> : "Verify Now"}
          </Button>

          <Link
            className="formResetPasswordLink formLink otpScreenLink"
            onClick={onBackClick}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OTPScreen;
