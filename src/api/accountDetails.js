import axiosInstance from "../utils/axiosInstance";

export const myAccountDetails = async (fSuccess, fError) => {
  try {
    let res = await axiosInstance.get(`/account/details`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error.response.data);
  }
};
export const updateProfile = async (body, fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(`/account/update-profile`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error.response.data);
  }
};
export const updatePassword = async (body, fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(`/account/update-password`, body);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error.response.data);
  }
};

export const deactivateAccount = async (fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(`/account/deactivate`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error.response.data);
  }
};
