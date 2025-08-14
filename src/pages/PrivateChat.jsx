import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdVideoCall } from "react-icons/md";
import { setActiveChat, setMessages } from "../store/chatSlice";
import axiosInstance from "../utils/axiosInstance";
import PageContainer from "../components/PageContainer";
import { useWebSocket } from "./WebSocketContext";
import Avatar from "../components/Avatar";
import { allPrivateChats, chatDetails } from "../api/privateChat";

function createChatId(senderId, recipientId) {
  return senderId > recipientId
    ? `${recipientId}_${senderId}`
    : `${senderId}_${recipientId}`;
}

export default function PrivateChat({ setIncomingCall, setIncomingMessage }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const chatState = useSelector((state) => state.chat);

  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");

  const { sendMessage, send } = useWebSocket();

  const activeChat = chatState.activeChat;
  const chatId = activeChat?.chatId;
  const messages = chatState.messages?.[chatId] || [];

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!activeChat) return;
    const id = activeChat.userId;
    const chatId = createChatId(currentUser.userId, id);
    chatDetails(
      id,
      (data) => dispatch(setMessages({ chatId, messages: data })),
      (err) => console.error(err)
    );
  }, [activeChat, currentUser?.userId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    allPrivateChats(
      (data) => setUsers(data),
      (err) => console.error(err)
    );
  }, []);

  const handleUserSelect = (user) => {
    const chatId = createChatId(currentUser.userId, user.userId);
    dispatch(setActiveChat({ ...user, chatId }));
  };

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    sendMessage(chatId, input, activeChat.email, new Date().toISOString());
    setInput("");
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleStartCall = () => {
    const chatId = createChatId(currentUser.userId, activeChat.userId);
    send("call-request", activeChat.email, {
      from: currentUser.email,
      chatId,
      toUserName: `${activeChat.firstName} ${activeChat.middleName} ${activeChat.lastName}`,
      fromUserName: `${currentUser.firstName} ${currentUser.middleName} ${currentUser.lastName}`,
    });
    setIncomingCall({
      from: currentUser.email,
      to: activeChat.email,
      chatId: chatId,
      toUserName: `${activeChat.firstName} ${activeChat.middleName} ${activeChat.lastName}`,
      fromUserName: `${currentUser.firstName} ${currentUser.middleName} ${currentUser.lastName}`,
    });
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <PageContainer>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col">
          <h2 className="p-4 text-lg font-semibold text-fuchsia-800 border-b border-gray-200">
            My Chats
          </h2>
          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.userId}
                onClick={() => handleUserSelect(user)}
                className={`p-3 cursor-pointer transition flex items-center rounded-lg mx-2 my-1 shadow-sm ${
                  activeChat?.userId === user.userId
                    ? "bg-fuchsia-100 text-fuchsia-900 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Avatar name={`${user.firstName} ${user.lastName}`} />
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 h-full">
          {activeChat && (
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar size={36} name={activeChat.firstName} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {activeChat.firstName} {activeChat.lastName}
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartCall}
                title="Start video call"
                className="p-2 rounded-full hover:bg-gray-100 text-fuchsia-700 transition"
              >
                <MdVideoCall size={20} />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-purple-50">
            {activeChat ? (
              <>
                {messages.map((msg, i) => {
                  const isOwn = msg.to !== currentUser.email;
                  return (
                    <div
                      key={i}
                      className={`max-w-xs md:max-w-sm px-4 py-2 rounded-xl text-sm shadow-sm ${
                        isOwn
                          ? "ml-auto bg-pink-200 text-gray-800"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      <div>{msg.content}</div>
                      <div className="text-[10px] text-gray-700 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="text-fuchsia-800 text-center mt-10">
                Select a user to start chat
              </div>
            )}
          </div>

          {/* Input */}
          {activeChat && (
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
          )}
        </div>
      </div>
    </PageContainer>
  );
}
