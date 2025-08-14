import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { createGroup } from "../../api/groupChat";
import Loader from "../Loader";
import MessageAlert from "../MessageAlert";

const CreateGroup = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    createGroup(
      { groupName: groupName },
      () => {
        setLoader(false);
        setAlertOpen(true);
        setMessage({ type: "success", msg: "Group Created" });
        setTimeout(() => onClose(), 2000);
      },
      (err) => {
        setLoader(false);
        setAlertOpen(true);
        setMessage({ type: "error", msg: err.message });
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-black/30">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        {loader && <Loader loading={loader} />}
        {alertOpen && (
          <MessageAlert
            message={message.msg}
            type={message.type}
            onClose={() => setAlertOpen(false)}
          />
        )}
        <div className="flex items-center justify-between px-4 py-3 bg-purple-100 border-b border-gray-300">
          <h2 className="text-md font-bold text-fuchsia-800">
            Create New Group
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 py-5 space-y-4">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-fuchsia-700 text-sm text-white px-4 py-1 rounded-md hover:bg-fuchsia-800 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
