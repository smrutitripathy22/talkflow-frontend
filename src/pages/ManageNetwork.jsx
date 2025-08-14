import React, { useEffect, useState, useCallback } from "react";
import PageContainer from "../components/PageContainer";
import ConnectionList from "../components/manageNetwork/ConnectionList";
import BlockedList from "../components/manageNetwork/BlockedList";
import { SentList } from "../components/manageNetwork/SentList";
import PendingList from "../components/manageNetwork/PendingList";
import {
  acceptConnectionRequest,
  allConnections,
  blockUser,
  rejectConnectionRequest,
  sendConnectionRequest,
  unblockUser,
  unConnections,
  withdrawConnectionRequest,
} from "../api/userConnection";
import AutoCompleteInput from "../components/AutoCompleteInput ";
import MessageAlert from "../components/MessageAlert";

const tabs = ["Connections", "Pending", "Sent Requests", "Blocked"];

const ManageNetwork = () => {
  const [activeTab, setActiveTab] = useState("Connections");
  const [data, setData] = useState({});
  const [nonConnected, setNonConnected] = useState([]);
  const [loaderCount, setLoaderCount] = useState(0);

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const getAllConnectedList = useCallback(() => {
    setLoaderCount((ps) => ps + 1);
    allConnections(
      (data) => {
        setData(data);
        setLoaderCount((ps) => ps - 1);
      },
      (error) => {
        setLoaderCount((ps) => ps - 1);
      }
    );
  }, []);

  const getAllUnconnections = useCallback(() => {
    setLoaderCount((ps) => ps + 1);
    unConnections(
      (data) => {
        setNonConnected(data);
        setLoaderCount((ps) => ps - 1);
      },
      (error) => {
        setLoaderCount((ps) => ps - 1);
      }
    );
  }, []);

  const handleApiCall = useCallback(
    (apiFunction, successMessage, ...args) => {
      setLoaderCount((ps) => ps + 1);

      const onSuccess = () => {
        getAllConnectedList();
        getAllUnconnections();

        setAlertInfo({ show: true, message: successMessage, type: "success" });
      };

      apiFunction(
        ...args,
        () => {
          onSuccess();
          setLoaderCount((ps) => ps - 1);
        },
        (error) => {
          setAlertInfo({
            show: true,
            message: error.message || "An unexpected error occurred.",
            type: "error",
          });
          setLoaderCount((ps) => ps - 1);
        }
      );
    },
    [getAllConnectedList, getAllUnconnections]
  );

  const handleSentRequest = (userId) =>
    handleApiCall(sendConnectionRequest, "Request sent successfully!", userId);
  const handleAcceptRequest = (connectionId) =>
    handleApiCall(
      acceptConnectionRequest,
      "Connection accepted!",
      connectionId
    );
  const handleWithdrawRequest = (connectionId) =>
    handleApiCall(
      withdrawConnectionRequest,
      "Request withdrawn.",
      connectionId
    );
  const handleRejectRequest = (connectionId) =>
    handleApiCall(rejectConnectionRequest, "Request rejected.", connectionId);
  const handleBlockRequest = (userId) =>
    handleApiCall(blockUser, "User blocked.", userId);
  const handleUnblockRequest = (connectionId) =>
    handleApiCall(unblockUser, "User has been unblocked.", connectionId);

  useEffect(() => {
    getAllConnectedList();
    getAllUnconnections();
  }, [getAllConnectedList, getAllUnconnections]);

  return (
    <PageContainer>
      {alertInfo.show && (
        <MessageAlert
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}
      <div className="max-w-2xl p-3">
        <h1 className="text-xl font-semibold mb-4 text-fuchsia-800">
          Manage My Network
        </h1>
        <div className="pb-4 ">
          <AutoCompleteInput
            suggestions={nonConnected}
            onConnect={handleSentRequest}
            onBlock={handleBlockRequest}
          />
        </div>

        <div className="flex space-x-6 border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-b-fuchsia-800 text-fuchsia-800"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Connections" && (
          <ConnectionList
            list={data?.acceptedList}
            onBlock={handleBlockRequest}
          />
        )}
        {activeTab === "Pending" && (
          <PendingList
            list={data?.pendingList}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        )}
        {activeTab === "Sent Requests" && (
          <SentList list={data?.sentList} onWithdraw={handleWithdrawRequest} />
        )}
        {activeTab === "Blocked" && (
          <BlockedList
            list={data?.blockedList}
            onUnblock={handleUnblockRequest}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ManageNetwork;
