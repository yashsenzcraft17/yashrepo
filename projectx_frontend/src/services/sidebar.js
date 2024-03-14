// import { postRequest } from "services/httpHelper";
// // import { SIDEBAR_MENU } from "services/apiUrl";

// // sidebar Data
// export const sidebarData = async () => {
//     try {
//     const response = await postRequest({
//       url: "https://px-usmdev.azurewebsites.net/collect_menu",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       requestData: {
//         email: "mohan@sketchbrahma.com",
//         role_id: "1"
//       }
//     });
//     return response?.data;
//   } catch (error) {
//     return error;
//   }
// };

import axios from "axios";
import { SIDEBAR_MENU } from "services/apiUrl";

export const sidebarData = async (body) => {
  // const requestData = {
  //   email: "mohan@sketchbrahma.com",
  //   role_id: "1"
  // };

  try {
    const response = await axios.post(`${SIDEBAR_MENU}`, body, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
