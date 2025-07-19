"use client";
import React from "react";
import Link from "next/link";

import AppImage from "../common/AppImage";
function PostItemUserProfilePage({ id, title, link, description, image }) {
  return (
    <div className="">
      <Link id={id} href={`/post/${id}`}>
        <AppImage
          className="w-full h-full object-cover"
          src={image}
          alt={title}
          // width="300"
          // height="300"
        />
      </Link>
    </div>
  );
}

export default PostItemUserProfilePage;
