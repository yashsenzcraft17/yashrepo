import React, { useEffect, useState } from "react";
import { updatePassword } from "services/login";
import { useNavigate } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "components/Button";
import { PasswordRules } from "constants/passwordRules";

import companyLogo from "assets/images/login/companyLogo.svg";

import showPassword from "assets/images/login/showPassword.svg";
import showPasswordOff from "assets/images/login/showPasswordOff.svg";
// import LoginWelcome from "components/LoginWelcome/index";

const UpdatePassword = ({
  emailVerifyToken,
  OTPVerifyToken,
  getWindowWidth
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswordText, setShowPasswordText] = useState({
    newPassword: false,
    confirmPassword: false
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPwdEyeActive, setNewPwdEyeActive] = useState(true);
  const [confirmPwdEyeActive, setConfirmPwdEyeActive] = useState(true);

  const customScoreWords = ["Too Weak", "Weak", "Okay", "Good", "Strong"];

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const isPasswordValid = (password) => {
    return passwordRegex.test(password);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setNewPasswordError("");
    setConfirmPasswordError("");

    // Check if new password is empty or below 8 characters
    if (!passwords.newPassword.trim()) {
      setNewPasswordError("Please enter a new password.");
      return;
    } else if (passwords.newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long.");
      return;
    }

    // Check if confirm password is empty
    if (!passwords.confirmPassword.trim()) {
      setConfirmPasswordError("Please enter the confirm password.");
      return;
    }

    if (!isPasswordValid(passwords.newPassword)) {
      setNewPasswordError("Please enter a strong password.");
      return;
    }

    if (passwords.newPassword === passwords.confirmPassword) {
      try {
        setLoading(true);
        const tokenValues = OTPVerifyToken;

        const emailValue = emailVerifyToken;

        const password = passwords.newPassword;

        const response = await updatePassword(
          tokenValues,
          emailValue,
          password
        );

        if (response?.status === "1") {
          toast.success(
            <>
              <span className="formSuccessMsg">
                Your Password has been updated.
              </span>
              <br />
              <span className="formSuccessSubMsg">
                Redirecting back to login.
              </span>
            </>,
            {
              position:
                getWindowWidth() <= 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT
            }
          );
          setTimeout(() => {
            navigate(0);
          }, 1300);
        } else if (response?.status === "0") {
          toast.error(
            <>
              <span className="formAPIError">{response?.err_msg}</span>
            </>,

            {
              position:
                getWindowWidth() <= 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT
            }
          );
        }
      } catch (error) {
        toast.error(
          <>
            <span className="formAPIError">
              An error occurred. Please try again.
            </span>
          </>,

          {
            position: toast.POSITION.BOTTOM_CENTER
          }
        );
      } finally {
        setLoading(false);
      }
    } else {
      setPasswordsMatch(false);
      setConfirmPasswordError("Passwords do not match");
    }
  };

  const handleChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });

    // Reset the specific error when the user types
    if (field === "newPassword") {
      setNewPasswordError("");
    } else if (field === "confirmPassword") {
      setConfirmPasswordError("");
    }

    // if (field === "newPassword" && !isPasswordValid(value)) {
    //   setNewPasswordError("Please enter a strong password.");
    // }
  };

  const handlePasswordData = (field) => {
    setShowPasswordText((prevPassword) => ({
      ...prevPassword,
      [field]: !prevPassword[field]
    }));

    if (field === "confirmPassword") {
      setIsInputFocused(false);
    } else {
      setIsInputFocused(true);
    }
  };

  useEffect(() => {
    if (showPasswordText.newPassword) setNewPwdEyeActive(false);
    else setNewPwdEyeActive(true);

    if (showPasswordText.confirmPassword) setConfirmPwdEyeActive(false);
    else setConfirmPwdEyeActive(true);
  }, [showPasswordText]);

  const preventCopyPaste = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="">
        <div className="formCompanyLogo companyLogoContainer">
          <img src={companyLogo} alt="companyLogo" />
        </div>

        <h3 className="formCompanyLogoHeader">Update Password</h3>

        <form className="formAllField">
          <div className="formPassword">
            <label className="passwordIcon formPasswordConfirm">
              New Password
              <input
                type={showPasswordText["newPassword"] ? "text" : "password"}
                name="newPassword"
                className={`formPwdIcon ${
                  newPasswordError ? "errorBorder" : ""
                }`}
                value={passwords.newPassword}
                placeholder="Enter your new password"
                onChange={(e) => handleChange("newPassword", e.target.value)}
                onFocus={() => {
                  setIsInputFocused(true);
                }}
                onBlur={() => setIsInputFocused(false)}
                onCopy={preventCopyPaste}
                onContextMenu={preventCopyPaste}
                onPaste={preventCopyPaste}
              />
              {/* <img
                    className="formPasswordImg"
                    src={showPassword}
                    alt="showPassword"
                    onClick={() => handlePasswordData("newPassword")}
                  /> */}
              {newPwdEyeActive ? (
                <img
                  className="formPasswordImg"
                  src={showPassword}
                  alt="showPassword"
                  onClick={() => handlePasswordData("newPassword")}
                />
              ) : (
                <img
                  className="formPasswordImg"
                  src={showPasswordOff}
                  alt="showPassword"
                  onClick={() => handlePasswordData("newPassword")}
                />
              )}
            </label>

            <PasswordStrengthBar
              className="formBar"
              password={passwords.newPassword}
              minLength={8}
              scoreWords={customScoreWords}
              shortScoreWord=""
            />

            {isInputFocused && (
              <div className="passwordRulesData">
                {PasswordRules.map((rule, index) => (
                  <div className="passwordRulesDataContent" key={index}>
                    <img
                      className="passwordRulesDataImg"
                      src={
                        rule.regex.test(passwords.newPassword)
                          ? rule.successImage
                          : rule.errorImage
                      }
                      alt={rule.text}
                    />
                    <span className="passwordRulesDataText">{rule.text}</span>
                  </div>
                ))}
              </div>
            )}

            {newPasswordError && <p className="error">{newPasswordError}</p>}
          </div>

          <div className="formPassword">
            <label className="passwordIcon formPasswordConfirm">
              Confirm Password
              <input
                type={showPasswordText["confirmPassword"] ? "text" : "password"}
                name="confirmPassword"
                className={`formPwdIcon ${
                  confirmPasswordError ? "errorBorder" : ""
                }`}
                value={passwords.confirmPassword}
                placeholder="Enter your confirm password"
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onPaste={preventCopyPaste}
                onContextMenu={preventCopyPaste}
              />
              {confirmPwdEyeActive ? (
                <img
                  className="formPasswordImg"
                  src={showPassword}
                  alt="showPassword"
                  onClick={() => handlePasswordData("confirmPassword")}
                />
              ) : (
                <img
                  className="formPasswordImg"
                  src={showPasswordOff}
                  alt="showPassword"
                  onClick={() => handlePasswordData("confirmPassword")}
                />
              )}
            </label>

            {!passwordsMatch && confirmPasswordError && (
              <p className="error">{confirmPasswordError}</p>
            )}
          </div>

          <Button
            className="formButton"
            type="button"
            onClick={handleUpdatePassword}
          >
            {loading ? <div className="formSpinner"></div> : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
