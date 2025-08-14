import React from "react";
import Sidebar from "./Sidebar";

const PageContainer = ({ children }) => {
  return (
    <div className="flex min-h-screen  bg-purple-25 rounded-lg ">
      <Sidebar />

      <main className="flex-1  ">{children}</main>
    </div>
  );
};

export default PageContainer;
