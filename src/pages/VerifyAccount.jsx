import React, { useState } from "react";
import { resendVerificationCode, verifyAccount } from "../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSuccess } from "../store/authSlice";
import { useDispatch } from "react-redux";
import MessageAlert from "../components/MessageAlert"; // 1. Import the alert component
import Loader from "../components/Loader"; // Import Loader

const VerifyAccount = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const [searchParams]= useSearchParams()

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setAlertInfo({
        show: true,
        message: "Please enter the verification code.",
        type: "error",
      });
      return;
    }
    setLoading(true);

    verifyAccount(
      token,
      (data) => {
        dispatch(
          loginSuccess({
            token: data.token,
            user: data.userData,
          })
        );
        navigate(data.userData.chatsExist ? "/chat" : "/managenetwork");
        setLoading(false);
      },
      (error) => {
       
        setLoading(false);
        setAlertInfo({
          show: true,
          message: error.message || "Verification failed. Please check the code and try again.",
          type: "error",
        });
      }
    );
  };

  const handleResend = async () => {
    setResending(true);
    resendVerificationCode(
     searchParams.get('email'),
      (data) => {
        setResending(false);
        setAlertInfo({
          show: true,
          message: data.message || "A new verification code has been sent.",
          type: "success",
        });
      },
      (error) => {
        setResending(false);
        setAlertInfo({
          show: true,
          message: error.message || "Failed to resend code. Please try again later.",
          type: "error",
        });
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-white justify-center">
  
      {(loading || resending) && <Loader loading={true} />}
      {alertInfo.show && (
        <MessageAlert
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}


      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gradient-to-tr from-purple-100 to-indigo-100">
        <div className="text-center p-10">
          <img
            src="coverPage.png"
            alt="TalkFlow visual"
            className="rounded-xl shadow-lg mb-6 max-w-xl mx-auto"
          />
          <h1 className="text-3xl font-bold text-purple-700">TalkFlow</h1>
          <p className="text-purple-600 mt-4 text-lg italic">
            "Talk one-on-one. Chat in groups. Connect face-to-face."
          </p>
        </div>
      </div>

    
      <div className="min-h-screen flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-12 py-8 bg-white shadow-lg">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            Account Verification
          </h2>
          <p className="text-sm text-purple-600 mb-6">
            Enter the verification code sent to your email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                placeholder="Enter the 8-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-2 rounded-md font-semibold transition"
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </form>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-purple-600 hover:underline text-sm"
            >
              {resending ? "Resending..." : "Resend Verification Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
