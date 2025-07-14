"use client";
import React, { useState } from "react";
import { FaPen, FaListUl } from "react-icons/fa";

export default function CreateModal({
  onClose,
  onPost,
  onList,
}) {
  return (
    <div
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md h-[12%] bg-[#000000] z-50 flex items-center justify-center px-6 shadow-lg transition-transform duration-1000 ease-in-out rounded"
      onClick={onClose}
    >
      <div
        className="w-full h-full flex items-center justify-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPost}
          className="flex flex-col items-center gap-2 text-[#FBF8F4] font-medium py-2 px-6 rounded w-2/3 justify-center border border-[#FBF8F4]"
        >
          <FaPen />
          create post
        </button>

        <button
          onClick={onList}
          className="flex flex-col items-center gap-2 text-[#FBF8F4] border border-[#FBF8F4] font-medium py-2 px-6 rounded w-2/3 justify-center"
        >
          <FaListUl />
          create list
        </button>
      </div>
    </div>
  );
}
