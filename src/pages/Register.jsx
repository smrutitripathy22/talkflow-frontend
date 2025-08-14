import React, { useState } from "react";
import { userRegistration } from "../api/auth";
import { useNavigate } from "react-router-dom";
import MessageAlert from "../components/MessageAlert";
import Loader from "../components/Loader";

const Register = () => {
  const [registrationDetails, setRegistrationDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationDetails((ps) => ({ ...ps, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } =
      registrationDetails;

    if (!firstName || !lastName || !email || !password) {
      setAlertInfo({
        show: true,
        message: "Please fill all required fields.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    userRegistration(
      registrationDetails,
      (data) => {
        setLoading(false);

        navigate(`/verify-account?email=${registrationDetails.email}`);
      },
      (error) => {
        setLoading(false);
        setAlertInfo({
          show: true,
          message: error.message || "Registration failed. Please try again.",
          type: "error",
        });
      }
    );
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

      <div className="min-h-screen flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-12 py-8 bg-white shadow-lg">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            Create your account
          </h2>
          <p className="text-sm text-purple-600 mb-6">
            Join TalkFlow to chat, call, and collaborate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                name="firstName"
                value={registrationDetails.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name (optional)
              </label>
              <input
                type="text"
                placeholder="Michael"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="middleName"
                value={registrationDetails.middleName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                name="lastName"
                value={registrationDetails.lastName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@talkflow.com"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                name="email"
                value={registrationDetails.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                name="password"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,20}$"
                title="Password must be 8-20 characters, include uppercase, lowercase, number, and special character"
                value={registrationDetails.password}
                onChange={handleChange}
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-2 rounded-md font-semibold transition"
            >
              {loading ? "Signing you up..." : "Sign Up"}
            </button>
          </form>

          {/* Link to Login */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:underline font-medium"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
