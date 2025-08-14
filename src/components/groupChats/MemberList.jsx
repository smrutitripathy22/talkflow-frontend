import React from "react";
import { IoClose } from "react-icons/io5"; // Make sure you have react-icons installed
import Avatar from "../Avatar";

const MemberList = ({ groupName, members = [], adminId = "", onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white shadow-lg p-0 rounded-xl w-full max-w-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-purple-100 border-b border-gray-300">
          <h2 className="text-md font-bold text-gray-800">
            {groupName} Members
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Member List */}
        <div className="p-4">
          <ul className="space-y-4">
            {members.map((member, idx) => (
              <li
                key={idx}
                className="flex flex-col  bg-white  rounded-lg shadow-sm p-1 "
              >
                <div>
                  {member.userId === adminId && (
                    <span className="ml-2 text-xs text-fuchsia-900 font-semibold ">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar
                    name={`${member.firstName} ${member.middleName} ${member.lastName}`}
                  />
                  <div>
                    <p className="font-semibold">
                      {member.firstName} {member.middleName} {member.lastName}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
