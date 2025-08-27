import axiosInstance from "../utils/axiosInstance";

export const allGroups = async (fSuccess, fError) => {
  try {
    let res = await axiosInstance.get(`/group`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};

export const allMembers = async (groupId, fSuccess, fError) => {
  try {
    let res = await axiosInstance.get(`/group/members/${groupId}`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const nonMembers = async (groupId, fSuccess, fError) => {
  try {
    let res = await axiosInstance.get(`/group/non-members/${groupId}`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const allChats = async (groupId, fSuccess, fError) => {
  try {
    let res = await axiosInstance.get(`/group/chats/${groupId}`);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const createGroup = async (body, fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(`/group`, body);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error.response.message);
  }
};
export const addMembers = async (groupId, memberId, fSuccess, fError) => {
  try {
    let res = await axiosInstance.post(
      `/group/member?groupId=${groupId}&memberId=${memberId}`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error.response.data);
  }
};
