import { postRequest } from "services/httpHelper";
import { GET_LEAD_FILTER, GET_CHANNEL_FILTER } from "./apiUrl";

export const getLeadListFilterData = async (email, startsWith) => {
  try {
    const response = await postRequest({
      url: GET_LEAD_FILTER,
      header: {
        "Content-Type": "application/json"
      },
      data: {
        email,
        startsWith: startsWith
      }
    });
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getChannelFilterData = async (email, startsWith) => {
  try {
    const response = await postRequest({
      url: GET_CHANNEL_FILTER,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        email,
        startsWith: startsWith
      }
    });
    return response?.data;
  } catch (error) {
    return error;
  }
};
