import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { EncryptStorage } from "encrypt-storage";

// API
import { loginData } from "services/login";

import Button from "components/Button";
// import Loader from "components/Loader";

// import loginForm from "assets/images/login/loginForm.png";
import companyLogo from "assets/images/login/companyLogo.svg";
import showPasswordImage from "assets/images/login/showPassword.svg";
import warningLogo from "assets/images/login/Warning.svg";
import showPasswordOff from "assets/images/login/showPasswordOff.svg";

import "react-toastify/dist/ReactToastify.css";
// import LoginWelcome from "components/LoginWelcome/index";
// import loaderGif from "assets/images/login/loader.gif";

// import { PASSWORD_RULES } from "services/apiUrl";

const LoginForm = ({ resetPassword, getWindowWidth }) => {
  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    password: ""
    // recaptcha: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
    // recaptcha: ""
  });

  const siteKey =
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
    "6LftEFspAAAAAMSlPQBOzRFIAvQeppJCM4fQWFm-";

  // const [passwordRules, setPasswordRules] = useState({
  //   email: "",
  //   password: ""
  // });
  const [eyeActive, setEyeActive] = useState(true);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(true);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {}, [emailRef]);

  // let debounceTimer;
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: value }));
    validateField(name, value);
  };

  const handleChange = (fieldName) => {
    const value =
      fieldName === "email"
        ? emailRef.current.value
        : passwordRef.current.value;

    if (value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: ""
      }));
    }

    // Update the form values
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [fieldName]: value
    }));
  };

  const validateField = (fieldName, value) => {
    if (fieldName === "email") {
      validateEmail(value);
    } else if (fieldName === "password") {
      validatePassword(value);
    }
  };

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const emailErrorMessage = !emailRegex.test(value ?? formValues.email)
      ? "Invalid email ID"
      : "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      email: emailErrorMessage
    }));
  };

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const errorMessage = !passwordRegex.test(value) ? "Invalid Password" : "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      password: errorMessage
    }));
  };

  // TODO
  const handleRecaptchaChange = (value) => {
    if (value) {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        recaptcha: value
      }));

      // Reset ReCAPTCHA error when value changes
      setErrors((prevErrors) => ({
        ...prevErrors,
        recaptcha: ""
      }));
    }
  };

  const handleRecaptchaExpired = () => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      recaptcha: "ReCAPTCHA verification has expired. Please try again."
    }));
  };

  const validateRecaptcha = () => {
    if (!formValues?.recaptcha) {
      const errorMessage = "ReCAPTCHA is required";
      setErrors((prevErrors) => ({
        ...prevErrors,
        recaptcha: errorMessage
      }));
    }
  };

  // Handles form submission, validates values, sets loading state, makes API call to log in.
  // If successful, stores token and data, shows success message, navigates to dashboard.
  // If API call fails, displays error message.

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateEmail(formValues?.email);
    validatePassword(formValues?.password);

    validateRecaptcha();
    // if (errors.email || errors.password || errors.recaptcha) {
    if (errors.email || errors.password || errors.recaptcha) {
      setLoading(false);
    } else {
      setLoading(true);

      // if (formValues?.email && formValues?.password && formValues?.recaptcha) {
      if (formValues?.email && formValues?.password && formValues?.recaptcha) {
        const response = await loginData(
          formValues?.email,
          formValues?.password,
          formValues?.recaptcha
        );

        if (response?.status === "1") {
          encryptStorage?.setItem("authToken", response?.token);
          encryptStorage?.setItem("authData", response);
          toast.success(
            <>
              <span className="formSuccessMsg">Successfully logged in</span>
            </>,
            {
              position:
                getWindowWidth() <= 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT,
              toastId: "1"
            }
          );
          navigate("/dashboard");
        } else {
          toast.error(
            <>
              <span className="formAPIError">
                {response?.err_msg || "Something went wrong!"}
              </span>
            </>,
            {
              position:
                getWindowWidth() <= 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT,
              toastId: "1"
            }
          );
        }
      }

      setLoading(false);
    }
  };

  const handlePasswordData = () => {
    setEyeActive((preVal) => !preVal);
    setShowPasswordText((prevPassword) => !prevPassword);
  };

  return (
    <div className="formCompanyLogo formCompanyLogoLogin">
      <div className="companyLogoContainer">
        <img src={companyLogo} alt="companyLogo" />
      </div>

      <form className="formAllField">
        <div className="formEmail">
          <label>Email ID</label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            className={`formMailIcon ${errors.email ? "errorBorder" : ""}`}
            onBlur={handleBlur}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email address"
            // autoComplete={false}
          />
          {errors.email && (
            <div className="error formOTPError">
              <img src={warningLogo} alt="warningLogo" />
              <p>{errors.email}</p>
            </div>
          )}
        </div>

        <div className="formPassword">
          <label className="passwordIcon">
            Password
            <input
              ref={passwordRef}
              type={showPasswordText ? "text" : "password"}
              onFocus={() => setIsPasswordFocused(true)}
              name="password"
              className={`formPwdIcon ${errors.password ? "errorBorder" : ""}`}
              onBlur={handleBlur}
              onChange={(e) => handleChange("password", e.target.value)}
              // autoComplete={false}
              placeholder="Enter your password"
            />
            {isPasswordFocused &&
              (eyeActive ? (
                <img
                  className="formPasswordImg"
                  src={showPasswordImage}
                  alt="showPassword"
                  onClick={handlePasswordData}
                />
              ) : (
                <img
                  className="formPasswordImg"
                  src={showPasswordOff}
                  alt="showPassword"
                  onClick={handlePasswordData}
                />
              ))}
          </label>
          {errors.password && (
            <div className="error formOTPError">
              <img className="errorImage" src={warningLogo} alt="warningLogo" />
              <p>{errors.password}</p>
            </div>
          )}
        </div>

        <div className="formCaptcha">
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={handleRecaptchaChange}
            onExpired={handleRecaptchaExpired}
            className="formRecaptcha"
          />
          {errors.recaptcha && <p className="error">{errors.recaptcha}</p>}
        </div>

        <Button
          onClick={handleSubmit}
          className="formButton"
          type="submit"
          disabled={loading}
        >
          {loading ? <div className="formSpinner"></div> : "Login"}
        </Button>

        <div className="formResetPassword">
          <span>
            Unable to login?{" "}
            <label onClick={resetPassword} className="formResetPasswordLink">
              Reset Password
            </label>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
