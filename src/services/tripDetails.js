import { TRIP_DETAILS } from "services/apiUrl";
// import { postRequest } from "services/httpHelper";
import axios from "axios";

// export const getTripDetails = async (
//   email,
//   tripId,
//   recordId,
//   roleId,
//   token
// ) => {
//   try {
//     const response = await postRequest({
//       url: TRIP_DETAILS,
//       header: {
//         "Content-Type": "application/json",
//         token
//       }
//     });
//     return response?.data;
//   } catch (error) {
//     return error;
//   }
// };

export const getTripDetails = async (body, token) => {
  try {
    const response = await axios.post(TRIP_DETAILS, body, {
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
