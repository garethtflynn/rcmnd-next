"use client";

import dynamic from "next/dynamic";

// Import the component with no SSR
const CreatePostForm = dynamic(
  () => import("../../../components/forms/CreatePostForm"),
  {
    ssr: false,
  }
);

export default function CreatePost() {
  return (
    <div className="h-screen w-full bg-[#000000]">
      <CreatePostForm />
    </div>
  );
}