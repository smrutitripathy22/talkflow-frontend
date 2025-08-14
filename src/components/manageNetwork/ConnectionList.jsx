import React from "react";
import AutoCompleteInput from "../AutoCompleteInput ";
import Avatar from "../Avatar";

const ConnectionList = ({ list = [], onBlock }) => {
  return (
    <div className="max-h-full overflow-y-auto pr-1">
      <ul className="space-y-4">
        {list.map((conn, idx) => (
          <li
            key={conn.userId}
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
              <button className="px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-500 hover:bg-fuchsia-900 text-gray-50 text-sm font-medium rounded-md transition">
                Unconnect
              </button>
              <button className="px-4 py-1 bg-red-700 hover:bg-red-800 text-gray-50 text-sm font-medium rounded-md transition">
                Block
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionList;
