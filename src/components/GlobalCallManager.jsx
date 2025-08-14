import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import CallWindow from "../pages/CallWindow";
import { useWebSocket } from "../pages/WebSocketContext";
import { FaPhoneAlt, FaPhoneSlash, FaTimes } from "react-icons/fa";

export default function GlobalCallManager({ incomingCall, setIncomingCall }) {
  const currentUser = useSelector((state) => state.auth.user);
  const { send, setOnCallEvent } = useWebSocket();
  const [showCall, setShowCall] = useState(false);
  const [activeCallPeer, setActiveCallPeer] = useState(null);
  const ringtoneRef = useRef(null);
  const [myName, setMyName] = useState("");
  const [peerName, setPeerName] = useState("");

  useEffect(() => {
    if (!currentUser?.email) return;
    setOnCallEvent((data) => {
    
      if (!data) return;
      if (data.to !== currentUser.email) return;

      switch (data.type) {
        case "call-request":
          setIncomingCall({
            from: data.from,
            to: data.to,
            chatId: data.chatId,
            fromUserName: data.fromUserName,
            toUserName: data.toUserName,
          });
          ringtoneRef.current
            ?.play()
            .catch((err) => console.error("Ringtone play error:", err));
          break;

        case "call-accept":
          setActiveCallPeer(data.from);
          setShowCall(true);
          ringtoneRef.current?.pause();
          ringtoneRef.current.currentTime = 0;
          break;

        case "call-decline":
          setIncomingCall(null);
          ringtoneRef.current?.pause();
          ringtoneRef.current.currentTime = 0;
          alert("Call declined");
          break;

        case "call-end":
          setShowCall(false);
          setIncomingCall(null);
          setActiveCallPeer(null);
          ringtoneRef.current?.pause();
          ringtoneRef.current.currentTime = 0;
          break;

        default:
          console.warn("Unhandled call event type:", data.type);
          break;
      }
    });
  }, [currentUser.email, setOnCallEvent]);

  if (!currentUser) return null;

  return (
    <div>
      <audio ref={ringtoneRef} src="/ringtone.mp3" loop />

      {incomingCall ? (
        incomingCall.from === currentUser.email ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
            <div className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-sm text-center border border-gray-200">
              {/* Calling Status */}
              <div className="flex justify-center mb-4 items-center gap-2.5 animate-pulse">
                <FaPhoneAlt className="text-fuchsia-500 text-3xl" />
                <p className="text-lg font-semibold text-gray-900">
                  Calling{" "}
                  <span className="text-fuchsia-900">
                    {incomingCall.toUserName}
                  </span>
                </p>
              </div>

              {/* End Call Button */}
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => {
                    send("call-end", incomingCall.to, {
                      from: currentUser.email,
                      chatId: incomingCall.chatId,
                      fromUserName: incomingCall.fromUserName,
                      toUserName: incomingCall.toUserName,
                    });
                    setIncomingCall(null);
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-md transition-all duration-200"
                >
                  <FaPhoneSlash />
                  End Call
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Callee UI
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
            <div className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-sm text-center border border-gray-200">
              {/* Phone Ring Icon */}
              <div className="flex justify-center mb-4">
                <FaPhoneAlt className="text-green-500 text-5xl animate-pulse" />
              </div>

              {/* Incoming Call Text */}
              <p className="text-lg font-semibold text-gray-900">
                Incoming call from{" "}
                <span className="text-fuchsia-900">
                  {incomingCall?.fromUserName}
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                {/* Accept Call */}
                <button
                  onClick={() => {
                    const peer = incomingCall.from;
                    setMyName(incomingCall.toUserName);
                    setPeerName(incomingCall.fromUserName);
                    send("call-accept", peer, {
                      from: currentUser.email,
                      chatId: incomingCall.chatId,
                      fromUserName: incomingCall.toUserName,
                      toUserName: incomingCall.fromUserName,
                    });

                    setIncomingCall(null);
                    setActiveCallPeer(peer);
                    setShowCall(true);
                    ringtoneRef.current?.pause();
                    ringtoneRef.current.currentTime = 0;
                  }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full shadow-md transition-all duration-200"
                >
                  <FaPhoneAlt /> Accept
                </button>

                {/* Decline Call */}
                <button
                  onClick={() => {
                    send("call-decline", incomingCall.from, {
                      from: currentUser.email,
                      chatId: incomingCall.chatId,
                    });
                    setIncomingCall(null);
                    ringtoneRef.current?.pause();
                    ringtoneRef.current.currentTime = 0;
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full shadow-md transition-all duration-200"
                >
                  <FaPhoneSlash /> Decline
                </button>
              </div>
            </div>
          </div>
        )
      ) : null}

      {/* Call Window */}
      {showCall && activeCallPeer && (
        <CallWindow
          myId={currentUser.email}
          peerId={activeCallPeer}
          isCaller={incomingCall?.from === currentUser.email}
          myName={
            incomingCall?.fromUserName ? incomingCall?.fromUserName : myName
          }
          peerName={
            incomingCall?.toUserName ? incomingCall?.toUserName : peerName
          }
          onEnd={() => {
            send("call-end", activeCallPeer, {
              from: currentUser.email,
            });
            setShowCall(false);
            setIncomingCall(null);
            setActiveCallPeer(null);
            ringtoneRef.current?.pause();
            ringtoneRef.current.currentTime = 0;
          }}
        />
      )}
    </div>
  );
}
