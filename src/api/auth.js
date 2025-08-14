import axios from "axios";

export const userLogin = async (body, fSuccess, fError) => {
  try {
    let res = await axios.post("http://localhost:9090/auth/login", body);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error);
  }
};
export const userRegistration = async (body, fSuccess, fError) => {
  try {
    let res = await axios.post("http://localhost:9090/auth/register", body);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error);
  }
};

export const verifyAccount = async (token, fSuccess, fError) => {
  try {
    let res = await axios.post(
      `http://localhost:9090/auth/verify?token=${token}`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error);
  }
};
export const resendVerificationCode = async (email, fSuccess, fError) => {
  try {
    let res = await axios.post(
      `http://localhost:9090/auth/resend-verification-token?email=${email}`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error);
  }
};
export const sendPasswordResetEmail =async (email, fSuccess, fError) => {
   try {
    let res = await axios.post(
      `http://localhost:9090/auth/forgot-password`,{email}
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    fError(error);
  }
  
};

export const resetPassword = async (token, password, onSuccess, onError) => {
  try {
    const res = await axios.post(
      "http://localhost:9090/auth/reset-password",
      { token, password }
    );
    onSuccess(res.data);
  } catch (err) {
    onError(err.response?.data || { message: "Server error" });
  }
};