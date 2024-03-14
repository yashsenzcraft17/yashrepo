import { LEAD_DASHBOARD, LEAD_CAPTURED } from "./apiUrl";
import axios from "axios";

export const getLeadDashboardData = async (body, token) => {
  try {
    const response = await axios.post(LEAD_DASHBOARD, body, {
      headers: {
        "Content-Type": "application/json",
        token
      }
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getLeadCapturedData = async (body, token) => {
  try {
    const response = await axios.post(LEAD_CAPTURED, body, {
      headers: {
        "Content-Type": "application/json",
        token
      }
    });
    return response;
  } catch (error) {
    return error;
  }
};
