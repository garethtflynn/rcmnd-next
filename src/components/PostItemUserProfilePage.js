"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
function PostItemUserProfilePage({ id, title, link, description, image }) {
  return (
    <div className="px-1 relative h-72 md:h-96">
      <Link id={id} href={link} target="_blank">
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={title}
          width="300"
          height="300"
        />
      </Link>
    </div>
  );
}

export default PostItemUserProfilePage;
