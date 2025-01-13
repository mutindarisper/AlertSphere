import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white h-screen flex">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Dashboard;
