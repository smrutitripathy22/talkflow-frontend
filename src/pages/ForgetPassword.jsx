import React, { useState } from "react";
import { sendPasswordResetEmail } from "../api/auth"; 
import MessageAlert from "../components/MessageAlert";
import Loader from "../components/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    sendPasswordResetEmail(
      email,
      () => {
        setAlertInfo({
          show: true,
          message:
            "If an account exists with this email, a password reset link has been sent. It will expire in 20 minutes.",
          type: "success",
        });
        setEmail("");
        setLoading(false);
      },
      (error) => {
        setAlertInfo({
          show: true,
          message: error.message || "Failed to send reset link. Try again later.",
          type: "error",
        });
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
      {loading && <Loader loading={true} />}
      {alertInfo.show && (
        <MessageAlert
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your registered email address, and we'll send you a link to reset your password. 
          The link will expire in <strong>20 minutes</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@talkflow.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-2 rounded-md font-semibold shadow transition duration-300"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-purple-600 hover:underline font-medium">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
