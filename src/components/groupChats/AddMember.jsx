import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  acceptConnectionRequest,
  allConnections,
} from "../../api/userConnection";
import { addMembers, nonMembers } from "../../api/groupChat";
import Avatar from "../Avatar";
import Loader from "../Loader";
import MessageAlert from "../MessageAlert";

const AddMember = ({ onClose, onAdd, group }) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    addGroupMember();
  };

  const addGroupMember = () => {
    setLoader(true);
    addMembers(
      group.id,
      selectedUserId,
      () => {
        setLoader(false);
        setAlertOpen(true);
        setMessage({ type: "success", msg: "User Added Successfully...!!" });
        setTimeout(() => onClose(), 2000);
      },
      (err) => {
        setLoader(false);
        setAlertOpen(true);

        setMessage({ type: "error", msg: err.message });
      }
    );
  };

  const getUserOptions = () => {
    setLoader(true);
  
    nonMembers(
      group.id,
      (data) => {
        setLoader(false);
        setUserOptions(data);
      },
      (err) => {setLoader(false);
        setAlertOpen(true);

        setMessage({ type: "error", msg: err.message })}
    );
  };

  useEffect(() => {
    getUserOptions();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-black/30">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm border border-gray-200 overflow-hidden">
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
            Add Member to {group.groupName}
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
            <label className="block text-sm  text-fuchsia-900 font-semibold mb-1">
              Select Member
            </label>
            <AutoCompleteInput
              userOptions={userOptions}
              onSelect={(id) => setSelectedUserId(id)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-fuchsia-700 text-white px-4 py-1 text-sm rounded-md hover:bg-fuchsia-800 transition"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;

const AutoCompleteInput = ({ userOptions = [], onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(userOptions);
    } else {
      const lowerSearch = searchTerm.toLowerCase();

      const filtered = userOptions.filter((user) =>
        [user.firstName, user.middleName, user.lastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(lowerSearch)
      );

      setFilteredUsers(filtered);
    }
  }, [searchTerm, userOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (user) => {
    setSearchTerm(
      [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
    );
    onSelect(user.userId);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        placeholder="Type name"
      />

      {showDropdown && filteredUsers.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.userId}
              onClick={() => handleSelect(user)}
              className="px-4 py-2 hover:bg-fuchsia-100 cursor-pointer text-sm flex items-center space-x-2.5"
            >
              <Avatar
                name={`${user.firstName} ${user.middleName} ${user.lastName}`}
              />
              <span>
                {user.firstName} {user.middleName} {user.lastName}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && filteredUsers.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg px-4 py-2 text-sm text-gray-500">
          No matches found
        </div>
      )}
    </div>
  );
};
