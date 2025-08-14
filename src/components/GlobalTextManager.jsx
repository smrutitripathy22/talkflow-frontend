import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { BiMessage } from "react-icons/bi";
import { clearNotification } from "../store/chatNotificationSlice";

const GlobalTextManager = () => {

  const notifications = useSelector(
    (state) => state.chatNotification.unreadMessages
  );

  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  

  const filtered = notifications.filter((n) => {
    const msgType = n.message.type;
    const sender =
      msgType === "private" ? n.message.sender.email : n.message.from;
    if (sender === currentUser?.email) return false;
    if (msgType === "private" && !location.pathname.startsWith("/chat"))
      return true;
    if (msgType === "group" && !location.pathname.startsWith("/groupchat"))
      return true;
    return false;
  });

  const latest = filtered[filtered.length - 1] || null;

  useEffect(() => {
    if (!latest) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      dispatch(clearNotification(latest.chatId));
    }, 10000);
    return () => clearTimeout(timer);
  }, [latest, dispatch]);

  if (!latest || !visible) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 w-[280px] flex flex-col items-start p-4 rounded-2xl shadow-lg bg-white text-gray-800 border border-gray-200 transform transition-all duration-500 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } hover:shadow-xl`}
    >
      <div className="flex justify-between w-full items-start">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm text-gray-500">
            New message received
          </span>
          {latest.message.type === "group" ? (
            <span>{latest.message.group.groupName}</span>
          ) : (
            <span className="font-semibold text-sm text-gray-700">
              From: {latest.message.sender.firstName} {latest.message.sender.lastName}
            </span>
          )}

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-800 leading-snug">
            <BiMessage className="text-gray-400" size={20} />
            <span className="truncate max-w-[200px]">
              {latest.message.content}
            </span>
          </div>
        </div>

        <IoClose
          size={20}
          className="cursor-pointer text-gray-400 hover:text-gray-600 ml-2"
          onClick={() => {
            setVisible(false);
            dispatch(clearNotification(latest.chatId));
          }}
        />
      </div>
    </div>
  );
};

export default GlobalTextManager;
