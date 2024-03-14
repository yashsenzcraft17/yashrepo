import axios from "axios";
import { TRIP_DASHBOARD } from "services/apiUrl";
// import { EncryptStorage } from "encrypt-storage";

// const encryptStorage = new EncryptStorage("senzcraft123#", {
//   prefix: ""
// });

// const token = encryptStorage.getItem("authToken");
// TripDashboard API
// export const getTripDashboardData = async (
//   email,
//   startDate,
//   endDate,
//   token,
//   roleId
// ) => {
//   try {
//     const response = await postRequest({
//       url: TRIP_DASHBOARD,
//       header: {
//         "Content-Type": "application/json",
//         token: token
//       },
//       noAuth: true,
//       data: {
//         email,
//         startDate,
//         endDate,
//         roleId
//       }
//     });
//     return response?.data;
//   } catch (error) {
//     return error;
//   }
// };

export const getTripDashboardData = async (body, token) => {
  try {
    const response = await axios.post(TRIP_DASHBOARD, body, {
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

export const getChartData = async (url, body, token) => {
  try {
    const response = await axios.post(url, body, {
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
