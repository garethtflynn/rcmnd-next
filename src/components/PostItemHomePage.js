"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import AppImage from "./AppImage";

export default function PostItemHomePage({
  id,
  userId,
  title,
  link,
  description,
  username,
  image,
  href,
}) {
  const [style, setStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    // console.log("Image is hovered", id);
    setIsHovered(true);
    setStyle({ opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    // console.log("Image hover ended");
    setIsHovered(false);
    setStyle({ opacity: 1 });
  };

  return (
    <div>
      <Link id={id} href={href}>
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AppImage
            className="w-full h-full object-cover duration-700"
            src={image}
            alt={title}
            // width={400}
            // height={400}
            style={style}
          />

          {isHovered && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-100">
              <p className="text-[#252220] text-lg text-center font-semibold">
                {title}
              </p>
            </div>
          )}
        </div>
      </Link>
      <Link
        href={`/user/${userId}`}
        className="text-[#F1E9DA] text-opacity-60 hover:text-opacity-30 text-sm pt-1"
      >
        @{username}
      </Link>
    </div>
  );
}
