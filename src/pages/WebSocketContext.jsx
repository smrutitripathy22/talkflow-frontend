import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { appendMessage } from "../store/chatSlice";
import { appendGroupMessage } from "../store/groupSlice";
import { addNotification } from "../store/chatNotificationSlice";

const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

const INITIAL_RECONNECT_INTERVAL = 1000;
const MAX_RECONNECT_INTERVAL = 30000;

export const WebSocketProvider = ({ url, children }) => {
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const reconnectIntervalRef = useRef(INITIAL_RECONNECT_INTERVAL);
  const reconnectTimeoutIdRef = useRef(null);
  const dispatch = useDispatch();

  const onSignalRef = useRef(() => {});
  const onCallEventRef = useRef(() => {});

  const connect = useCallback(() => {
    console.log("WebSocket connecting...");
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      reconnectIntervalRef.current = INITIAL_RECONNECT_INTERVAL;
      if (reconnectTimeoutIdRef.current) {
        clearTimeout(reconnectTimeoutIdRef.current);
        reconnectTimeoutIdRef.current = null;
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data.type);

      switch (data.type) {
        case "chat":
        case "private": {
          const chatId = data.chatId;
          dispatch(appendMessage({ chatId, message: data }));
          dispatch(addNotification({ chatId, message: data }));
          break;
        }
        case "group": {
          const chatId = `group_${data.groupId}`;
          dispatch(appendGroupMessage({ chatId, message: data }));
          dispatch(addNotification({ chatId, message: data }));
          break;
        }
        case "call-request":
        case "call-accept":
        case "call-decline":
        case "call-end": {
          onCallEventRef.current(data);
          break;
        }
        case "offer":
        case "answer":
        case "ice-candidate":
        case "signal": {
          onSignalRef.current(data);
          break;
        }
        default:
          console.log("Unhandled message type:", data.type);
          break;
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket error");
      socket.close();
    };

    socket.onclose = (event) => {
      if (event.code === 1000) {
        console.log("WebSocket closed intentionally");
        return;
      }
      console.log("WebSocket disconnected, reconnecting...");
      reconnectTimeoutIdRef.current = setTimeout(
        connect,
        reconnectIntervalRef.current
      );
      reconnectIntervalRef.current = Math.min(
        reconnectIntervalRef.current * 2,
        MAX_RECONNECT_INTERVAL
      );
    };
  }, [url, dispatch]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutIdRef.current) {
        clearTimeout(reconnectTimeoutIdRef.current);
      }
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = (chatId, contentOrPayload, to = "", timestamp = null) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not open");
      return;
    }
    let message;
    if (typeof contentOrPayload === "object") {
      message = contentOrPayload;
    } else {
      message = {
        type: "private",
        chatId,
        content: contentOrPayload,
        to,
        timestamp,
        sender: user,
      };
    }
    socketRef.current.send(JSON.stringify(message));
  };

  const send = (type, to, payload = {}, signalType = "") => {
    const message = { type, to, from: user?.email, signalType, ...payload };
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.log("WebSocket not open");
    }
  };

  const sendGroupMsg = (
    type,
    groupId,
    content,
    chatId,
    timestamp,
    from,
    user,
    selectedGroup
  ) => {
    const message = { type, groupId, content, chatId, timestamp, from, user ,group:selectedGroup};
    socketRef.current.send(JSON.stringify(message));
  };

  return (
    <WebSocketContext.Provider
      value={{
        sendMessage,
        send,
        sendGroupMsg,
        setOnSignal: (fn) => (onSignalRef.current = fn),
        setOnCallEvent: (fn) => (onCallEventRef.current = fn),
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
