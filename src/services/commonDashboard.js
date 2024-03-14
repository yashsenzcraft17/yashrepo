// import { postRequest } from "services/httpHelper";
import { COMMON_DASHBOARD } from "services/apiUrl";
import axios from "axios";

// export const getDashboardData = async (data) => {
//   try {
//     console.log(data);
//     const response = await postRequest({
//       url: COMMON_DASHBOARD,
//       headers: {
//         "Content-Type": "application/json"
//       },

//       body: JSON.stringify(data)
//     });

//     return response?.data;
//   } catch (error) {
//     return error;
//   }
// };

export const getDashboardData = async (body, token) => {
  try {
    const response = await axios.post(COMMON_DASHBOARD, body, {
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
