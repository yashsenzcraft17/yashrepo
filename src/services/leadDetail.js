import axios from "axios";
import {
  LEAD_DETAIL,
  LEAD_DETAILS_LIST,
  LEAD_DETAILS_RECORD_LIST,
  LEAD_DETAIL_REJECT_REASON,
  LEAD_DETAIL_UPDATE_FLAG,
  LEAD_DETAIL_UPDATE_LEAD
} from "services/apiUrl";

export const getLeadDetails = async (body, token) => {
  try {
    const response = await axios.post(LEAD_DETAIL, body, {
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

export const getLeadDetailsList = async (body, token) => {
  try {
    const response = await axios.post(LEAD_DETAILS_LIST, body, {
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

export const getLeadDetailsRecordList = async (body, token) => {
  try {
    const response = await axios.post(LEAD_DETAILS_RECORD_LIST, body, {
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

export const getLeadRejectReason = async (body, token) => {
  try {
    const response = await axios.post(LEAD_DETAIL_REJECT_REASON, body, {
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

export const getLeadDetailUpdateLead = async (body, token) => {
  try {
    const response = await axios.post(LEAD_DETAIL_UPDATE_LEAD, body, {
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

export const getLeadDetailUpdateFlag = async (body, token) => {
  try {
    const response = await axios.post(LEAD_DETAIL_UPDATE_FLAG, body, {
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
