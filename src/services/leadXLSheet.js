import axios from "axios";
import { LEAD_XL_SHEET } from "./apiUrl";

export const leadXlExportData = async (body, token) => {
  try {
    const response = await axios.post(LEAD_XL_SHEET, body, {
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
