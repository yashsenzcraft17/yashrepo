import axios from "axios";
import { EXPORT_XLSX } from "./apiUrl";

export const exportExcel = async (body, token) => {
  try {
    const response = await axios.post(EXPORT_XLSX, body, {
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
