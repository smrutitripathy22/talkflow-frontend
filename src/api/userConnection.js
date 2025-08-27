import axiosInstance from "../utils/axiosInstance";

export const allConnections = async (fSuccess, fError) => {
  try {
    let res = await axiosInstance.get("/connection/all");
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const unConnections = async (fSuccess, fError) => {
  try {
    let res = await axiosInstance.get("/connection/unconnected");

    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const sendConnectionRequest = async (userId, fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(`/connection/add/${userId}`);
 
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};

export const blockUser = async (userId, fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(`/connection/blocked/${userId}`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};

export const acceptConnectionRequest = async (
  connectionId,
  fSuccess,
  fError
) => {
  try {
    let res = await axiosInstance.post(
      `/connection/update/${connectionId}/accepted`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};

export const withdrawConnectionRequest = async (
  connectionId,
  fSuccess,
  fError
) => {
  try {
    let res = await axiosInstance.post(
      `/connection/update/${connectionId}/withdrawn`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const rejectConnectionRequest = async (
  connectionId,
  fSuccess,
  fError
) => {
  try {
    let res = await axiosInstance.post(
      `/connection/update/${connectionId}/rejected`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const unblockUser = async (connectionId, fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(
      `/connection/update/${connectionId}/unblocked`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
