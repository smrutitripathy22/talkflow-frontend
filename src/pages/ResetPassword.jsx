import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";
import MessageAlert from "../components/MessageAlert";
import Loader from "../components/Loader";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlertInfo({
        show: true,
        message: "Passwords do not match.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    resetPassword(
      token,
      password,
      () => {
        setAlertInfo({
          show: true,
          message: "Password reset successfully! Redirecting to login...",
          type: "success",
        });
        setTimeout(() => navigate("/login"), 2000);
        setLoading(false);
      },
      (error) => {
        setAlertInfo({
          show: true,
          message: error.message || "Failed to reset password. Try again.",
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
        <h2 className="text-2xl font-bold text-purple-900 mb-4">
          Set New Password
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please enter your new password. The reset link will expire in{" "}
          <strong>20 minutes</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,20}$"
              title="Password must be 8-20 characters, include uppercase, lowercase, number, and special character"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-2 rounded-md font-semibold shadow transition duration-300"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-purple-600 hover:underline font-medium"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
