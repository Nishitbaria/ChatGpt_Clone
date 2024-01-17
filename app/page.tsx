import Bubbles from "@/components/Bubbles";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen  justify-between overflow-y-hidden bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <Bubbles />
      </div>
    </div>
  );
};

export default page;
