/* eslint-disable no-undef */
const BASE_URL = process.env.REACT_APP_BASE_URL;

const BASE_URL1 = process.env.REACT_APP_BASE_URL1;
const BASE_URL3 = process.env.REACT_APP_BASE_URL3;
// const BASE_URL2 = process.env.REACT_APP_BASE_URL2; // Commented out
const BASE_URL4 = process.env.REACT_APP_BASE_URL4;

console.log("BASE_URL",BASE_URL);

// export const BASE_URL = "https://px-usm.azurewebsites.net";
// export const BASE_URL1 = "https://px-tms.azurewebsites.net";
// export const BASE_URL3 = "https://px-mds.azurewebsites.net";
// // export const BASE_URL2 = "https://px-usmdev.azurewebsites.net";
// export const BASE_URL4 = "https://px-lms.azurewebsites.net";


// JSON API
export const TRIP_DETAILS = `${BASE_URL1}/get_trip_details`;

export const GET_LOGIN_DATA = `${BASE_URL}/login`;

export const VERIFICATION_CODE = `${BASE_URL}/send_otp`;

export const OTP_VERIFICATION = `${BASE_URL}/validate_otp`;

export const UPDATE_PASSWORD = `${BASE_URL}/update_password`;

export const PASSWORD_RULES = `${BASE_URL}/password_rules`;

export const SIDEBAR_MENU = `${BASE_URL}/collect_menu`;

export const COMMON_DASHBOARD = `${BASE_URL1}/common_dashboard`;

export const FILTER_API = `${BASE_URL3}/get_city_list`;

export const ROUTE_CODE = `${BASE_URL3}/get_route_list`;

export const TRIP_DASHBOARD = `${BASE_URL1}/trip_dashboard_others?`;

export const TRIP_LIST = `${BASE_URL1}/trip_list`;

export const TRIP_COUNT_CHART = `${BASE_URL1}/trip_dashboard_drill_down_trip_count`;

export const COST_SAVING_CHART = `${BASE_URL1}/trip_dashboard_drill_down_cost_saving`;

export const LOAD_TYPE = `${BASE_URL3}/get_load_type`;

export const TRIP_MAP = `${BASE_URL1}/get_trip_route`;

export const EXPORT_XLSX = `${BASE_URL1}/export_trip_dashboard_data`;

export const LEAD_DETAIL = `${BASE_URL4}/lead_details`;

export const LEAD_LIST = `${BASE_URL4}/lead_list`;

export const LEAD_DASHBOARD = `${BASE_URL4}/lead_dashboard`;

export const LEAD_CAPTURED = `${BASE_URL4}/lead_by_channel_trend_chart`;

export const GET_LEAD_FILTER = `${BASE_URL3}/get_lead_type_list`;

export const GET_CHANNEL_FILTER = `${BASE_URL3}/get_lead_channel_list`;

export const LEAD_DETAILS_LIST = `${BASE_URL3}/get_pick_list_values`;

export const LEAD_DETAILS_RECORD_LIST = `${BASE_URL3}/get_recordtype_values`;

export const LEAD_DETAIL_REJECT_REASON = `${BASE_URL3}/get_reject_reason_list`;

export const LEAD_DETAIL_UPDATE_LEAD = `${BASE_URL4}/update_lead`;

export const LEAD_DETAIL_UPDATE_FLAG = `${BASE_URL3}/get_request_update_flag`;

export const LEAD_XL_SHEET = `${BASE_URL4}/export_lead_dashboard_data`;
