"use client";

import dynamic from "next/dynamic";

// Import the component with no SSR
const CreatePostForm = dynamic(
  () => import("../../../components/CreatePostForm"),
  {
    ssr: false,
  }
);

export default function CreatePost() {
  return (
    <div className="h-screen w-full bg-[#110A02]">
      <CreatePostForm />
    </div>
  );
}

// import CreatePostForm from "@/components/CreatePostForm";

// export default function CreatePost() {
//   return (
//     <div className='h-screen w-full bg-[#110A02]'>
//       <CreatePostForm />
//     </div>
//   );
// }
