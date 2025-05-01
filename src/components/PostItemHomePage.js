"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function PostItemHomePage({
  id,
  title,
  link,
  description,
  image,
}) {
  const [style, setStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  // Function to handle hover
  const handleMouseEnter = () => {
    //custom logic for when the image is hovered
    // console.log("Image is hovered", id);
    setIsHovered(true);
    setStyle({ opacity: 0.25 }); // Opacity should be a value between 0 and 1
  };

  // Function to handle hover end
  const handleMouseLeave = () => {
    // Your custom logic for when the hover ends
    // console.log("Image hover ended");
    setIsHovered(false);
    setStyle({ opacity: 1 });
  };

  return (
    <Link id={id} href={`/post/${id}`}>
      <div
        className="relative h-72 md:h-96"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Normal Image */}
        <Image
          className="w-full h-full object-cover duration-700"
          src={image}
          alt={title}
          width={400}
          height={400}
          style={style}
        />
        {/* Title Overlay */}
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-100">
            <p className="text-[#D7CDBF] text-lg font-semibold">{title}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
