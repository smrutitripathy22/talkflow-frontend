import React, { useState } from "react";
import { FiMessageSquare, FiSettings, FiLogOut, FiUsers } from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";
import Tooltip from "./Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice"; // Adjust path as needed
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
const currentUser = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);

  const navLinks = [
    {
      name: "Chats",
      icon: <FiMessageSquare className="w-5 h-5" />,
      route: "/chat",
    },
    {
      name: "Spaces",
      icon: <MdSpaceDashboard className="w-5 h-5" />,
      route: "/groupchat",
    },
    {
      name: "Network",
      icon: <FiUsers className="w-5 h-5" />,
      route: "/managenetwork",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // redirect to login after logout
  };

  const bottomLinks = [
    {
      name: "Settings",
      icon: <FiSettings className="w-5 h-5" />,
      onClick: () => navigate("/settings"),
    },
    {
      name: "Logout",
      icon: <FiLogOut className="w-5 h-5" />,
      onClick: handleLogout,
    },
  ];

  return (
    <aside className="flex h-screen w-15 flex-col justify-between border-r border-gray-200 bg-purple-50 py-4">
      {/* Top Nav Links */}
      <div className="space-y-4">
        <nav className="flex flex-col items-center space-y-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.route);
            return (
              <Tooltip key={link.name} label={link.name}>
                <Link
                  to={link.route}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.icon}
                </Link>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Bottom Links + Profile */}
      <div className="flex flex-col items-center space-y-4">
        <nav className="flex flex-col items-center space-y-2">
          {bottomLinks.map((link) => (
            <Tooltip key={link.name} label={link.name}>
              <button
                style={{ cursor: "pointer" }}
                onClick={link.onClick}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              >
                {link.icon}
              </button>
            </Tooltip>
          ))}
        </nav>

        <Tooltip label="Profile">
          <img
            style={{ cursor: "pointer" }}
            onClick={() => setOpenModal(true)}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200"
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            alt="User Profile"
          />
        </Tooltip>
      </div>
      <Modal isOpen={openModal} setOpen={setOpenModal}>
  <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl  max-w-sm mx-auto">
    {/* Profile Image */}
    <img
      className="rounded-full w-32 h-32 object-cover mb-4 border-4 border-indigo-500"
      src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
      alt="User Profile"
    />

    {/* User Info */}
    <div className="text-center space-y-2">
      <h2 className="text-xl font-semibold text-gray-800">
        {currentUser.firstName} {currentUser.MiddleName} {currentUser.lastName}
      </h2>
      <p className="text-gray-600">{currentUser.email}</p>
    </div>

    {/* Optional Close Button */}
    <button
      onClick={() => setOpenModal(false)}
      className="mt-6 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition"
    >
      Close
    </button>
  </div>
</Modal>

    </aside>
  );
};

export default Sidebar;
