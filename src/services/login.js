import { getRequest, postRequest } from "services/httpHelper";
import {
  GET_LOGIN_DATA,
  OTP_VERIFICATION,
  PASSWORD_RULES,
  UPDATE_PASSWORD,
  VERIFICATION_CODE
} from "services/apiUrl";

// Login Data
export const loginData = async (email, password) => {
  try {
    const response = await postRequest({
      url: GET_LOGIN_DATA,
      header: {
        "Content-Type": "application/json"
      },
      data: {
        email,
        password
      }
    });

    return response?.data;
  } catch (error) {
    return error;
  }
};

// resetPassword
export const resetPassword = async (email) => {
  try {
    const response = await postRequest({
      url: VERIFICATION_CODE,
      header: {
        "Content-Type": "application/json"
      },
      noAuth: true,
      data: {
        email
      }
    });

    return response?.data;
  } catch (error) {
    return error;
  }
};

// resetPassword
export const enterOTP = async (otp, token, email) => {
  try {
    const response = await postRequest({
      url: OTP_VERIFICATION,
      headers: {
        "Content-Type": "application/json",
        token: token
      },
      noAuth: true,
      data: {
        email,
        otp
      }
    });

    return response?.data;
  } catch (error) {
    return error;
  }
};

// UpdatePassword
export const updatePassword = async (token, email, password) => {
  try {
    const response = await postRequest({
      url: UPDATE_PASSWORD,
      headers: {
        "Content-Type": "application/json",
        token: token
      },
      noAuth: true,
      data: { email, password }
    });

    return response?.data;
  } catch (error) {
    return error;
  }
};

// PasswordRules
export const getCustomData = async () => {
  try {
    const response = await getRequest({
      url: PASSWORD_RULES,
      headers: {
        "Content-Type": "application/json"
      },
      noAuth: true
    });
    return response.data;
  } catch (error) {
    return {};
  }
};
