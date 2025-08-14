import React from "react";
import Avatar from "../Avatar";

const PendingList = ({ list = [], onAccept, onReject }) => {
  return (
    <div className="p-4 h-full">
      {/* Scrollable list container */}
      <div className="max-h-full overflow-y-auto pr-1">
        <ul className="space-y-4">
          {list.map((conn, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm  "
            >
              <div className="flex items-center space-x-4">
                <Avatar
                  name={`${conn.firstName} ${conn.middleName} ${conn.lastName}`}
                />
                <div>
                  <p className="font-semibold text-sm text-fuchsia-900">
                    {conn.firstName} {conn.middleName} {conn.lastName}
                  </p>
                  <p className="text-sm">{conn.email} </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onAccept(conn.connectionId)}
                  className="px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-500 hover:bg-fuchsia-900 text-gray-50 text-sm font-medium rounded-md transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(conn.connectionId)}
                  className=" px-4 py-1 bg-red-700 hover:bg-red-800 text-gray-50 text-sm font-medium rounded-md transition"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PendingList;
