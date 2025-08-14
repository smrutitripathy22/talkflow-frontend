import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./WebSocketContext";
import { MdCallEnd, MdScreenShare, MdStopScreenShare } from "react-icons/md";
import { FiMic, FiMicOff } from "react-icons/fi";

const CallWindow = ({
  myId,
  peerId,
  onEnd,
  isCaller,
  myName = "Me",
  peerName = "Guest",
}) => {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenTrackRef = useRef(null);

  const { send, setOnSignal } = useWebSocket();

  const [isMuted, setIsMuted] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [sharedScreenBy, setSharedScreenBy] = useState(null);

  const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    setOnSignal(async ({ candidate, sdp, type, from, isSharing }) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      console.log("Received signal:", { candidate, sdp, type, from });

      if (type === "screen-share") {
        setSharedScreenBy(isSharing ? from : null);
        return;
      }

      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("Added ICE candidate");
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }

      if (sdp) {
        try {
          if (sdp.type === "offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            console.log("Set remote offer");

            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
            localRef.current.srcObject = stream;
            localStreamRef.current = stream;
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            send("signal", peerId, { sdp: answer });
            console.log("Sent answer");
          } else if (sdp.type === "answer") {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            console.log("Set remote answer");
          }
        } catch (err) {
          console.error("SDP error:", err);
        }
      }
    });
  }, [peerId, send, setOnSignal]);

  // --- Setup PeerConnection ---
  useEffect(() => {
    const setupConnection = async () => {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          send("signal", peerId, { candidate: event.candidate });
          console.log("Sent ICE candidate");
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
      };

      pc.ontrack = (event) => {
        console.log("Received remote track:", event.track);
        if (remoteRef.current) {
          remoteRef.current.srcObject = event.streams[0];
        }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localRef.current.srcObject = stream;
        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        if (isCaller) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          send("signal", peerId, { sdp: offer });
          console.log("Sent offer");
        }
      } catch (err) {
        console.error("Error accessing camera/microphone:", err);
      }
    };

    setupConnection();

    return () => {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
    };
  }, [peerId, send, isCaller]);

  // --- End call ---
  const handleEnd = () => {
    peerConnectionRef.current?.close();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenTrackRef.current?.stop();
    send("call-end", peerId, { from: myId });
    onEnd();
  };

  // --- Mute / unmute ---
  const toggleMute = () => {
    const pc = peerConnectionRef.current;
    const audioSender = pc?.getSenders().find((s) => s.track?.kind === "audio");
    if (!audioSender?.track) return;

    audioSender.track.enabled = isMuted;
    setIsMuted(!isMuted);
  };

  // --- Screen sharing ---
  const toggleScreenShare = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (!isSharingScreen && sharedScreenBy && sharedScreenBy !== myId) {
      alert("The other user is already sharing their screen.");
      return;
    }

    if (isSharingScreen) {
      // Stop sharing and return to camera
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const videoTrack = camStream.getVideoTracks()[0];
      const videoSender = pc
        .getSenders()
        .find((s) => s.track?.kind === "video");
      if (videoSender && videoTrack) await videoSender.replaceTrack(videoTrack);

      localRef.current.srcObject = camStream;
      localStreamRef.current = camStream;
      screenTrackRef.current?.stop();
      screenTrackRef.current = null;

      setIsSharingScreen(false);
      setSharedScreenBy(null);
      send("screen-share", peerId, {
        type: "screen-share",
        from: myId,
        isSharing: false,
      });
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        const videoSender = pc
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (videoSender && screenTrack)
          await videoSender.replaceTrack(screenTrack);

        const combinedStream = new MediaStream([screenTrack]);
        const audioTrack = localStreamRef.current?.getAudioTracks()[0];
        if (audioTrack) combinedStream.addTrack(audioTrack);

        localRef.current.srcObject = combinedStream;
        screenTrackRef.current = screenTrack;
        setIsSharingScreen(true);
        setSharedScreenBy(myId);

        send("screen-share", peerId, {
          type: "screen-share",
          from: myId,
          isSharing: true,
        });

        screenTrack.onended = () => toggleScreenShare();
      } catch (err) {
        console.error("Screen share error:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative w-full h-full">
        {/* Remote Video */}
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {peerName}
        </div>

        {/* Local Video */}
        <div className="absolute bottom-4 right-4 w-40 h-28 rounded shadow-lg border-2 border-white overflow-hidden">
          <video
            ref={localRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
            {myName}
          </div>
        </div>

        {/* Buttons */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={handleEnd}
            className="w-12 h-12 bg-red-600 rounded-full text-white flex items-center justify-center text-xl hover:bg-red-700"
            title="End Call"
          >
            <MdCallEnd />
          </button>

          <button
            onClick={toggleMute}
            className="w-12 h-12 bg-gray-600 rounded-full text-white flex items-center justify-center text-xl hover:bg-gray-700"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FiMicOff /> : <FiMic />}
          </button>

          <button
            onClick={toggleScreenShare}
            className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center text-xl hover:bg-blue-700"
            title={isSharingScreen ? "Stop Sharing" : "Share Screen"}
          >
            {isSharingScreen ? <MdStopScreenShare /> : <MdScreenShare />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallWindow;
