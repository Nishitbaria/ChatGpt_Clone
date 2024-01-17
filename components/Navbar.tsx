import Image from "next/image";
import React from "react";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineNotificationsNone } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-[#334155]">
      <div className="flex items-center space-x-4">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/2814/2814666.png"
          alt="Picture of the author"
          width={50}
          height={50}
        />

        <span className="text-xl font-bold text-white">AI CHATBOT.</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-[#334155] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-white mx-3"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            placeholder="Search anything..."
            className="bg-transparent py-2 pr-3 text-white placeholder-white focus:outline-none"
            type="text"
            data-ms-editor="true"
          />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="text-white h-6 w-6"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="text-white h-6 w-6"
        >
          <path d="M17 6.1H3"></path>
          <path d="M21 12.1H3"></path>
          <path d="M15.1 18H3"></path>
        </svg>
        <div className="relative">
          <button className="block h-8 w-8 rounded-full overflow-hidden border-2 border-white focus:outline-none">
            <Image
              className="h-full w-full object-cover aspect-w-1 aspect-h-1"
              src="https://www.urbanbrush.net/web/wp-content/uploads/edd/2018/06/web-20180612001009501452.png"
              alt="Your avatar"
              width="32"
              height="32"
            />
          </button>
          <div className="absolute top-0 right-0 block h-2 w-2 transform translate-x-1/2 -translate-y-1/2 bg-[#22C55E] rounded-full ring-2 ring-white"></div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="text-white h-4 w-4"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;
