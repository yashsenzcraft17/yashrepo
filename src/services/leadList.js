import axios from "axios";
import { LEAD_LIST } from "./apiUrl";

export const getLeadListData = async (body, token) => {
  try {
    const response = await axios.post(LEAD_LIST, body, {
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
