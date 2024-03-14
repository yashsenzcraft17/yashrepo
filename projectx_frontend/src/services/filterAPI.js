import { postRequest } from "services/httpHelper";
import { FILTER_API, LOAD_TYPE, ROUTE_CODE } from "services/apiUrl";

// filterAPI
export const getOriginOptions = async (email, startsWith) => {
  try {
    const response = await postRequest({
      url: FILTER_API,
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

export const getRouteCodeOptions = async (email, startsWith) => {
  try {
    const response = await postRequest({
      url: ROUTE_CODE,
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

export const getLoadType = async (email, startsWith) => {
  try {
    const response = await postRequest({
      url: LOAD_TYPE,
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
