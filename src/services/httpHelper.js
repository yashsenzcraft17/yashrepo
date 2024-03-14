import axios from "axios";

export const sendRequest = async (args) => {
  let bearerToken;
  try {
    const { url, headers, noAuth, data, serverCookie = "" } = args;
    bearerToken = serverCookie;
    let headerParams;
    if (noAuth) {
      if (headers) {
        headerParams = {
          Authorization: `Bearer ${bearerToken}`,
          ...headers
        };
      } else {
        headerParams = {
          Authorization: `Bearer ${bearerToken}`
        };
      }
    }

    const options = {
      ...args,
      headers: headerParams,
      url: url
    };

    if (data) {
      options.data = data;
    }

    const response = await axios(options);

    return response;
  } catch (error) {
    return { error };
  }
};

export const getRequest = async (args) => {
  const { data, headers, error, status } = await sendRequest({
    ...args,
    method: "get"
  });
  if (status === 200) {
    return {
      data,
      error: null,
      headers,
      status
    };
  }
  return {
    data,
    error: error || data,
    status
  };
};

export const postRequest = async (args) => {
  const { data, headers, error, status } = await sendRequest({
    ...args,
    method: "post"
  });

  if ([200, 201, 204].indexOf(status) > -1) {
    return {
      data,
      error: null,
      headers,
      status
    };
  }
  return {
    data: null,
    error: error || data,
    status
  };
};

export const patchRequest = async (args) => {
  const { data, headers, error, status } = await sendRequest({
    ...args,
    method: "patch"
  });
  if ([200, 201, 204].indexOf(status) > -1) {
    return {
      data,
      error: null,
      headers,
      status
    };
  }
  return {
    data: null,
    error: error || data,
    status
  };
};

export const deleteRequest = async (args) => {
  const { data, error, status, headers } = await sendRequest({
    ...args,
    method: "delete"
  });
  if ([200, 201, 204].indexOf(status) > -1) {
    return {
      data,
      error: null,
      headers,
      status
    };
  }
  return {
    data: null,
    error: error || data,
    status
  };
};

export const putRequest = async (args) => {
  const { data, error, status, headers } = await sendRequest({
    ...args,
    method: "put"
  });
  if ([200, 201, 204].indexOf(status) > -1) {
    return {
      data,
      error: null,
      headers,
      status
    };
  }
  return {
    data: null,
    error: error || data,
    status
  };
};
