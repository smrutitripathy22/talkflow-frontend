import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

const AutoCompleteInput = ({ suggestions = [], onConnect, onBlock }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(suggestions);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(suggestions);
    } else {
      const filteredSuggestions = suggestions.filter(
        ({ firstName, middleName, lastName }) =>
          `${firstName} ${middleName || ""} ${lastName}`
            .toLowerCase()
            .includes(query.toLowerCase())
      );
      setFiltered(filteredSuggestions);
    }
  }, [query, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-xl relative" ref={wrapperRef}>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search by name..."
        value={query}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 max-h-60 overflow-auto shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((person, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                     
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${person.firstName} ${person.lastName}`
                      )}`
                    }
                    alt={`${person.firstName} ${person.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                    title={`${person.firstName} ${person.middleName || ""} ${
                      person.lastName
                    }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${person.firstName} ${person.lastName}`
                      )}`;
                    }}
                  />
                  <span className="font-medium">
                    {[person.firstName, person.middleName, person.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onConnect(person.userId);
                      setQuery("");
                      setIsOpen(false);
                    }}
                    className="px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-500 hover:bg-fuchsia-900 text-gray-50 text-sm font-medium rounded-md transition"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => {
                      onBlock(person.userId);
                      setQuery("");
                      setIsOpen(false);
                    }}
                    className="px-4 py-1 bg-red-700 hover:bg-red-800 text-gray-50 text-sm font-medium rounded-md transition"
                  >
                    Block
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-gray-500 text-center flex flex-col items-center justify-center">
              <FiSearch className="text-2xl text-gray-400 mb-1" />
              <span className="font-medium">No matches found</span>
              <span className="text-sm text-gray-400">Try another name</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
