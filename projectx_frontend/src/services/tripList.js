import { TRIP_LIST } from "./apiUrl";
import axios from "axios";

export const getTripListData = async (body, token) => {
  try {
    const response = await axios.post(TRIP_LIST, body, {
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
