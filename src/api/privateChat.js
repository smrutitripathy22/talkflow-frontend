import axiosInstance from "../utils/axiosInstance";

export const allPrivateChats = async (fSuccess, fError) => {
  try {
    let res = await axiosInstance.get(`/chat/previews`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error);
  }
};
export const chatDetails = async (id, fSuccess, fError) => {
  try {
    let res = await axiosInstance.get(`/chat/${id}`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error);
  }
};
