import axios from "axios";

const axiosInstanceNoAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const userLogin = async (body, fSuccess, fError) => {
  try {
    let res = await axiosInstanceNoAuth.post("/auth/login", body);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
    
    fError(error.response.data);
  }
};
export const userRegistration = async (body, fSuccess, fError) => {
  try {
    let res = await axiosInstanceNoAuth.post("/auth/register", body);
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};

export const verifyAccount = async (token, fSuccess, fError) => {
  try {
    let res = await axiosInstanceNoAuth.post(
      `http://localhost:9090/auth/verify?token=${token}`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const resendVerificationCode = async (email, fSuccess, fError) => {
  try {
    let res = await axiosInstanceNoAuth.post(
      `http://localhost:9090/auth/resend-verification-token?email=${email}`
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
};
export const sendPasswordResetEmail =async (email, fSuccess, fError) => {
   try {
    let res = await axiosInstanceNoAuth.post(
      `http://localhost:9090/auth/forgot-password`,{email}
    );
    if (res.data) fSuccess(res.data.data);
  } catch (error) {
   fError(error.response.data)
  }
  
};

export const resetPassword = async (token, password, onSuccess, onError) => {
  try {
    const res = await axiosInstanceNoAuth.post(
      "http://localhost:9090/auth/reset-password",
      { token, password }
    );
    onSuccess(res.data);
  } catch (err) {
    onError(err.response?.data || { message: "Server error" });
  }
};