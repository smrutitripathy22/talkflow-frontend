import React, { useEffect, useRef, useState } from "react";
import PageContainer from "../components/PageContainer";
import { useWebSocket } from "./WebSocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setActiveGroup, setMessages } from "../store/groupSlice";
import { CgAddR } from "react-icons/cg";
import { IoPersonAdd } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import MemberList from "../components/groupChats/MemberList";
import { allChats, allGroups, allMembers } from "../api/groupChat";
import CreateGroup from "../components/groupChats/CreateGroup";
import AddMember from "../components/groupChats/AddMember";
import Loader from "../components/Loader";
import Avatar from "../components/Avatar";
import MessageAlert from "../components/MessageAlert";

const GroupChat = () => {
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loaderCount, setLoaderCount] = useState(0);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const currentUser = useSelector((state) => state.auth.user);
  const groupState = useSelector((state) => state.group);

  const messagesEndRef = useRef(null);

  const [input, setInput] = useState("");
  const { sendGroupMsg } = useWebSocket();
  const selectedGroup = groupState.activeGroup;
  const messages = groupState.messages?.[`group_${selectedGroup?.id}`] || [];

  const handleSend = () => {
    if (!input.trim()) return;

    sendGroupMsg(
      "group",
      selectedGroup?.id,
      input,
      `group_${selectedGroup.id}`,
      new Date().toISOString(),
      currentUser.email,
      currentUser,
      selectedGroup
    );
    setInput("");
  };

  const handleInputChange = (e) => setInput(e.target.value);

  useEffect(() => {
    setLoaderCount((ps) => ps + 1);
    allGroups(
      (data) => {
        setGroups(data);
        setLoaderCount((ps) => ps - 1);
      },
      (err) => {
        setLoaderCount((ps) => ps - 1);

        setAlertInfo({
          show: true,
          message: err.message || "Failed to load groups.",
          type: "error",
        });
      }
    );
  }, [showAddGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedGroup) return;
    const id = selectedGroup.id;
    const chatId = `group_${selectedGroup.id}`;
    setLoaderCount((ps) => ps + 1);
    allChats(
      id,
      (data) => {
        dispatch(setMessages({ chatId, messages: data }));
        setLoaderCount((ps) => ps - 1);
      },
      (err) => {
        setLoaderCount((ps) => ps - 1);
        setAlertInfo({
          show: true,
          message: err.message || "Failed to load chat history.",
          type: "error",
        });
      }
    );
    setLoaderCount((ps) => ps + 1);
    allMembers(
      id,
      (data) => {
        setLoaderCount((ps) => ps - 1);
        setGroupMembers(data);
      },
      (error) => {
        setLoaderCount((ps) => ps - 1);

        setAlertInfo({
          show: true,
          message: error.message || "Failed to load group members.",
          type: "error",
        });
      }
    );
  }, [selectedGroup, currentUser?.userId, dispatch, showAddMember]);

  return (
    <PageContainer>
      <div className="flex h-screen bg-gray-50">
        {loaderCount > 0 && <Loader loading={true} />}
        {alertInfo.show && (
          <MessageAlert
            type={alertInfo.type}
            message={alertInfo.message}
            onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          />
        )}

        <div className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-fuchsia-800">
              My Groups
            </h2>
            <button
              onClick={() => setShowAddGroup(true)}
              title="Create Group"
              aria-label="Create Group"
              className="text-fuchsia-800 hover:text-fuchsia-900 transition-colors"
            >
              <CgAddR size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => {
                  dispatch(setActiveGroup(group));
                }}
                className={`p-3 cursor-pointer transition flex items-center rounded-lg mx-2 my-1 shadow-sm ${
                  selectedGroup?.id === group.id
                    ? "bg-fuchsia-100 text-fuchsia-900 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Avatar name={group.groupName} />
                <div className="ml-3">
                  <p className="text-sm font-medium">{group.groupName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1 h-full">
          {selectedGroup ? (
            <>
              <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedGroup.groupName} size={36} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedGroup.groupName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGroupMembers(true)}
                    title="View Members"
                    aria-label="View Members"
                    className="text-fuchsia-600 hover:text-fuchsia-800 transition-colors"
                  >
                    <FaUsers size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowAddMember(true)}
                    title="Add Member"
                    aria-label="Add Member"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <IoPersonAdd size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-purple-50">
                {messages.map((msg, i) => {
                  const isOwn = msg.from === currentUser.email;
                  const fullName = `${msg.user.firstName || ""} ${
                    msg.user.lastName || ""
                  }`.trim();
                  return (
                    <div
                      key={i}
                      className={`flex items-start space-x-2 ${
                        isOwn ? "justify-end" : ""
                      }`}
                    >
                      {!isOwn && (
                        <Avatar name={fullName} avatar={msg.user.profileUrl} />
                      )}
                      <div
                        className={`max-w-xl px-4 py-2 rounded-xl text-sm shadow-sm ${
                          isOwn
                            ? "bg-pink-200 text-gray-800"
                            : "bg-white text-gray-800"
                        }`}
                        style={{ wordBreak: "break-word" }}
                      >
                        {!isOwn && (
                          <div className="text-xs font-semibold text-fuchsia-900 mb-1">
                            {fullName}
                          </div>
                        )}
                        <div>{msg.content}</div>
                        <div className="text-[10px] text-gray-500 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      {isOwn && (
                        <Avatar
                          name={`${currentUser.firstName} ${currentUser.lastName}`}
                          avatar={currentUser.profileUrl}
                        />
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 bg-white shadow-inner flex gap-2 rounded-t-lg">
                <input
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-gray-50"
                />
                <button
                  onClick={handleSend}
                  className="px-5 py-2 bg-gradient-to-r from-fuchsia-700 via-fuchsia-600 to-pink-500 hover:from-fuchsia-800 hover:to-pink-600 text-white text-sm font-medium rounded-full shadow transition"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-fuchsia-900 text-center">
              Select a Group to start chatting
            </div>
          )}
        </div>
      </div>
      {showGroupMembers && (
        <MemberList
          members={groupMembers}
          adminId={selectedGroup.createdBy.userId}
          groupName={selectedGroup.groupName}
          onClose={() => setShowGroupMembers(false)}
        />
      )}
      {showAddMember && (
        <AddMember
          group={selectedGroup}
          onClose={() => setShowAddMember(false)}
        />
      )}
      {showAddGroup && <CreateGroup onClose={() => setShowAddGroup(false)} />}
    </PageContainer>
  );
};

export default GroupChat;
