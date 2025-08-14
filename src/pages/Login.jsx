import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { userLogin } from "../api/auth";
import { useNavigate } from "react-router-dom";
import MessageAlert from "../components/MessageAlert"; // 1. Import the alert component
import Loader from "../components/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleLogin = urlParams.get("google");
    const token = urlParams.get("token");
    const userEncoded = urlParams.get("user");

    if (googleLogin === "success" && token && userEncoded) {
      try {
        setLoading(true);
        const userJson = decodeURIComponent(userEncoded);
        const userData = JSON.parse(userJson);

        dispatch(
          loginSuccess({
            token,
            user: userData,
          })
        );

        navigate(userData.chatsExist ? "/chat" : "/managenetwork");
      } catch (error) {
        setAlertInfo({
          show: true,
          message: "Failed to process Google login data. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((ps) => ({ ...ps, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    userLogin(
      loginDetails,
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
          message:
            error.message || "Login failed. Please check your credentials.",
          type: "error",
        });
      }
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9090/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-white justify-center">
      {loading && <Loader loading={true} />}
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

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-12 py-12 bg-white shadow-lg min-h-screen">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold text-purple-900 mb-2">
            Welcome To Talk Flow
          </h2>
          <p className="text-purple-600 mb-6 text-sm">
            Sign in to access your chats.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@talkflow.com"
                name="email"
                className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={loginDetails.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={loginDetails.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-1 text-right">
              <a
                href="/forgot-password"
                className="text-sm text-purple-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-2 rounded-md font-semibold shadow transition duration-300 cursor-pointer"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition cursor-pointer"
            >
              <img src="/google.png" alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-purple-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
