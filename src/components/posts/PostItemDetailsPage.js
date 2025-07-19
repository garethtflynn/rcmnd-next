// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSession } from "next-auth/react";

// import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
// import { AppImage } from "../common";

// export default function PostItemDetailsPage({
//   id,
//   title,
//   link,
//   description,
//   image,
//   username,
//   userId,
// }) {
//   const { data: session } = useSession();
//   const currentUserId = session?.user?.id;
//   const [isFavorited, setIsFavorited] = useState(false);

//   const isOwner = currentUserId === session?.user?.id;

//   useEffect(() => {
//     const checkFavoriteStatus = async () => {
//       if (!session || !currentUserId) return;

//       try {
//         const response = await fetch(`/api/favorites/${id}`);
//         if (response.ok) {
//           const data = await response.json();
//           console.log(data)
//           setIsFavorited(data.isFavorited);
//         }
//       } catch (error) {
//         console.error("Error checking favorite status:", error);
//       }
//     };

//     checkFavoriteStatus();
//   }, [id, session, currentUserId]);

//   const handleFavClick = async () => {
//     if (!session) {
//       console.log("User not authenticated");
//       return;
//     }

//     try {
//       const method = isFavorited ? "DELETE" : "POST";

//       const response = await fetch(`/api/favorites/${id}`, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to update favorite");
//       }

//       const data = await response.json();
//       setIsFavorited(!isFavorited);
//       console.log(data.message);
//     } catch (error) {
//       console.error("Error updating favorite:", error);
//     }
//   };

//   return (
//     <div
//       id={id}
//       className="h-screen w-full bg-[#000000] place-content-center place-items-center px-1 text-[#D7CDBF] md:grid md:grid-cols-2"
//     >
//       <div className="mx-auto w-6/12 md:w-8/12 xl:w-6/12">
//         <AppImage
//           className="mx-auto"
//           src={image}
//           alt={title}
//           // width="300"
//           // height="300"
//         />
//       </div>
//       <div className="w-full h-fit sm:px-4 py-4 md:w-3/4 md:px-0 md:pt-0 text-[#D7CDBF]">
//         <div className="flex flex-row justify-between items-center">
//           <Link href={`/user/${userId}`} className="hover:opacity-50">
//             <h1 className="text-xl">@{username}</h1>
//           </Link>
//           {isFavorited ? (
//             <FaBookmark
//               className="cursor-pointer"
//               onClick={handleFavClick}
//               color="#FBF8F4"
//               size={20}
//             />
//           ) : (
//             <FaRegBookmark
//               className="cursor-pointer"
//               onClick={handleFavClick}
//               color="#FBF8F4"
//               size={20}
//             />
//           )}
//         </div>
//         <h1 className="text-lg pt-4 pb-1">NOTES</h1>
//         <div className="border rounded mx-1 p-4">
//           <p>{title}</p>
//           <br />
//           <Link href={link} target="_blank">
//             <p className="hover:opacity-50 underline underline-offset-2">
//               link
//             </p>
//           </Link>
//           <br />
//           <p className="italic">{description}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { AppImage } from "../common";

export default function PostItemDetailsPage({
  id,
  title,
  link,
  description,
  image,
  username,
  userId,
}) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [isFavorited, setIsFavorited] = useState(false);

  // Fixed the isOwner logic - should compare currentUserId with userId (post owner)
  const isOwner = currentUserId === userId;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // Don't check favorite status if user is the owner
      if (!session || !currentUserId || isOwner) return;

      try {
        const response = await fetch(`/api/favorites/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [id, session, currentUserId, isOwner]);

  const handleFavClick = async () => {
    if (!session || isOwner) {
      console.log("User not authenticated or is owner");
      return;
    }

    try {
      const method = isFavorited ? "DELETE" : "POST";

      const response = await fetch(`/api/favorites/${id}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update favorite");
      }

      const data = await response.json();
      setIsFavorited(!isFavorited);
      console.log(data.message);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <div
      id={id}
      className="h-screen w-full bg-[#000000] place-content-center place-items-center px-1 text-[#D7CDBF] md:grid md:grid-cols-2"
    >
      <div className="mx-auto w-6/12 md:w-8/12 xl:w-6/12">
        <AppImage
          className="mx-auto"
          src={image}
          alt={title}
          // width="300"
          // height="300"
        />
      </div>
      <div className="w-full h-fit sm:px-4 py-4 md:w-3/4 md:px-0 md:pt-0 text-[#D7CDBF]">
        <div className="flex flex-row justify-between items-center">
          <Link href={`/user/${userId}`} className="hover:opacity-50">
            <h1 className="text-xl">@{username}</h1>
          </Link>
          {/* Only show favorite icon if user is not the owner */}
          {!isOwner && (
            <>
              {isFavorited ? (
                <FaBookmark
                  className="cursor-pointer"
                  onClick={handleFavClick}
                  color="#FBF8F4"
                  size={20}
                />
              ) : (
                <FaRegBookmark
                  className="cursor-pointer"
                  onClick={handleFavClick}
                  color="#FBF8F4"
                  size={20}
                />
              )}
            </>
          )}
        </div>
        <h1 className="text-lg pt-4 pb-1">NOTES</h1>
        <div className="border rounded mx-1 p-4">
          <p>{title}</p>
          <br />
          <Link href={link} target="_blank">
            <p className="hover:opacity-50 underline underline-offset-2">
              link
            </p>
          </Link>
          <br />
          <p className="italic">{description}</p>
        </div>
      </div>
    </div>
  );
}
