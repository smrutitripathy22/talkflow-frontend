import React, { useEffect, useState } from "react";
import { FiLock, FiUpload, FiUser } from "react-icons/fi";
import PageContainer from "../components/PageContainer";
import {
  deactivateAccount,
  myAccountDetails,
  updatePassword,
  updateProfile,
} from "../api/accountDetails";
import Modal from "../components/Modal";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MessageAlert from "../components/MessageAlert";
import Loader from "../components/Loader";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    profileUrl: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [loaderCount, setLoaderCount] = useState(0);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: "", type: "success" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function getAccountDetails() {
    setLoaderCount((ps) => ps + 1);
    myAccountDetails(
      (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setLoaderCount((ps) => ps - 1);
      },
      (error) => {
     
        setAlertInfo({ show: true, message: "Failed to load account details.", type: "error" });
        setLoaderCount((ps) => ps - 1);
      }
    );
  }

  useEffect(() => {
    getAccountDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileUrl" && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setFormData((prev) => ({ ...prev, profileUrl: url, profileImageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

 const submitProfile = (e) => {
  e.preventDefault();
  setLoaderCount((ps) => ps + 1);

  const formDataToSend = new FormData();
  formDataToSend.append("firstName", formData.firstName || "");
  formDataToSend.append("middleName", formData.middleName || "");
  formDataToSend.append("lastName", formData.lastName || "");

  if (formData.profileImageFile) {
    formDataToSend.append("profileImage", formData.profileImageFile);
  }

  updateProfile(
    formDataToSend,
    () => {
      setAlertInfo({ show: true, message: "Profile updated successfully!", type: "success" });
      setLoaderCount((ps) => ps - 1);
      getAccountDetails(); 
    },
    (error) => {
      setAlertInfo({ show: true, message: error.message || "Failed to update profile.", type: "error" });
      setLoaderCount((ps) => ps - 1);
    }
  );
};

  const submitPassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = formData;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setAlertInfo({ show: true, message: "Please fill all password fields.", type: "error" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAlertInfo({ show: true, message: "New passwords do not match.", type: "error" });
      return;
    }
    setLoaderCount((ps) => ps + 1);
    updatePassword(
      { password: currentPassword, updatePassword: newPassword },
      () => {
        setAlertInfo({ show: true, message: "Password updated successfully!", type: "success" });
        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmNewPassword: "" }));
        setLoaderCount((ps) => ps - 1);
      },
      (error) => {
   
        setAlertInfo({ show: true, message: error.message || "Failed to update password.", type: "error" });
        setLoaderCount((ps) => ps - 1);
      }
    );
  };

  const handleDeactivate = () => {
    setLoaderCount((ps) => ps + 1);
    deactivateAccount(
      () => {
        setDeactivateModal(false);
        dispatch(logout());
        navigate("/login");
        setLoaderCount((ps) => ps - 1);
      },
      (err) => {
       
        setAlertInfo({ show: true, message: err.message || "Failed to deactivate account.", type: "error" });
        setLoaderCount((ps) => ps - 1);
        setDeactivateModal(false);
      }
    );
  };

  return (
    <PageContainer>
      {loaderCount > 0 && <Loader loading={true} />}
      {alertInfo.show && (
        <MessageAlert
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}
      <div className="max-w-6xl px-4 py-2 text-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-left text-fuchsia-800">
          Account Settings
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            {/* Profile Form */}
            <form onSubmit={submitProfile} className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-fuchsia-700 mb-3">My Profile</h2>
              <div className="flex items-center gap-5 mb-6">
                <img
                  src={formData?.profileUrl || "https://ui-avatars.com/api/?name=User"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <label className="flex items-center gap-2 text-sm text-fuchsia-600 cursor-pointer hover:underline">
                  <FiUpload className="text-base" />
                  <span>Change profile picture</span>
                  <input type="file" name="profileUrl" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {["firstName", "middleName", "lastName"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace("N", " N")}
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                        placeholder={field === "firstName" ? "John" : field === "lastName" ? "Doe" : "M."}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-end">
                <button type="submit" className="bg-fuchsia-700 text-sm text-white px-4 py-2 rounded-md hover:bg-fuchsia-800 transition">
                  Update Profile Details
                </button>
              </div>
            </form>

            {/* Password Form */}
            {formData.canChangePassword ? (
              <form onSubmit={submitPassword} className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-fuchsia-700 mb-3">Password</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "Current Password", name: "currentPassword" },
                    { label: "New Password", name: "newPassword" },
                    { label: "Confirm New Password", name: "confirmNewPassword" },
                  ].map(({ label, name }) => (
                    <div key={name} className={name === 'confirmNewPassword' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium mb-1">{label}</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="password"
                          name={name}
                          pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,20}$"
         title="Password must be 8-20 characters, include uppercase, lowercase, number, and special character"
                          value={formData[name] || ""}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-400 focus:outline-none text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button type="submit" className="bg-fuchsia-700 text-sm text-white px-4 py-2 rounded-md hover:bg-fuchsia-800 transition">
                    Update Password
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start gap-2 bg-fuchsia-50 border border-fuchsia-200 rounded-md p-3 mt-3 text-sm text-fuchsia-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  You logged in using <strong>Google</strong>. To change your password, please visit your{" "}
                  <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-fuchsia-700 font-medium hover:underline">
                    Google Account settings
                  </a>.
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Deactivate */}
          <div className="w-full md:max-w-sm space-y-6">
            <section className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-fuchsia-700 mb-3">
                Deactivate Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Deactivating your account will hide your profile and activity
                from others. You can reactivate your account by logging back in.
              </p>

              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 mb-4">
                <li>Your data will be retained but hidden.</li>
                <li>You won't receive notifications.</li>
                <li>You can reactivate at any time.</li>
              </ul>

              <p className="text-sm text-gray-600 mb-6">
                If you're sure, click below to begin the deactivation process.
              </p>

              <button
                type="button"
                onClick={() => setDeactivateModal(true)}
                className="text-red-600 hover:text-red-700 font-medium hover:underline text-sm"
              >
                I want to deactivate my account
              </button>
            </section>
          </div>
        </div>
      </div>
      <Modal isOpen={deactivateModal} setOpen={setDeactivateModal}>
        <h2 className="text-xl font-semibold mb-2">Deactivate Account</h2>
        <hr className="border-gray-200 mb-4" />
        <p className="text-gray-700 mb-6">Are you sure you want to deactivate your account?</p>
        <hr className="border-gray-200 mb-6" />
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition" onClick={() => setDeactivateModal(false)}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition" onClick={handleDeactivate}>
            Deactivate
          </button>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default Settings;
