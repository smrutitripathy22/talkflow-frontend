import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyAccount from "./pages/VerifyAccount";
import PrivateChat from "./pages/PrivateChat";
import GroupChat from "./pages/GroupChat";
import ManageNetwork from "./pages/ManageNetwork";
import Settings from "./pages/Settings";

import GlobalCallManager from "./components/GlobalCallManager";
import GlobalTextManager from "./components/GlobalTextManager";
import { WebSocketProvider } from "./pages/WebSocketContext";

import { useState } from "react";
import { isTokenExpired } from "./utils/tokenValidation";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token || !user || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { token } = useSelector((state) => state.auth);

  const [incomingCall, setIncomingCall] = useState(null);
  const [message, setMessage] = useState(null);

  return (
    <>
      <Routes>
     
        <Route
          index
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {token && (
          <Route
            path="/*"
            element={
              <WebSocketProvider url={`ws://localhost:9090/ws?token=${token}`}>
                <Routes>
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <PrivateChat
                          setIncomingCall={setIncomingCall}
                          setIncomingMessage={setMessage}
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/groupchat"
                    element={
                      <ProtectedRoute>
                        <GroupChat />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/managenetwork"
                    element={
                      <ProtectedRoute>
                        <ManageNetwork />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                </Routes>

             
                <GlobalCallManager
                  incomingCall={incomingCall}
                  setIncomingCall={setIncomingCall}
                />
                <GlobalTextManager
                  message={message}
                  setMessage={setMessage}
                />
              </WebSocketProvider>
            }
          />
        )}
      </Routes>
    </>
  );
}

export default App;
