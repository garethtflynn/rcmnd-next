"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { FaBookmark, FaRegBookmark, FaExternalLinkAlt } from "react-icons/fa";
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

  // checking if signed in user is the owner of the post
  const isOwner = currentUserId === userId;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // Don't check favorite status if user is the owner
      if (!session || !currentUserId || isOwner) return;

      try {
        const response = await fetch(`/api/favorites/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
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
    <div className="min-h-screen w-full bg-[#000000] text-[#F1E9DA]">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:items-center">
          <div className="mx-auto w-6/12 md:w-6/12 xl:w-6/12">
            <AppImage className="mx-auto" src={image} alt={title} />
          </div>
          {/* Content Section */}
          <div className="space-y-6 lg:space-y-8">
            {/* Header with user and bookmark */}
            <div className="flex items-center justify-between">
              {!isOwner ? (
                <Link
                  href={`/user/${userId}`}
                  className="group flex items-center space-x-2 transition-all duration-300 hover:text-[#FBF8F4]"
                >
                  <h2 className="text-xl font-medium group-hover:translate-x-1 transition-transform duration-300">
                    @{username}
                  </h2>
                </Link>
              ) : (
                <Link
                  href={`/profilePage`}
                  className="group flex items-center space-x-2 transition-all duration-300 hover:text-[#FBF8F4]"
                >
                  <h2 className="text-xl font-medium group-hover:translate-x-1 transition-transform duration-300">
                    @{username}
                  </h2>
                </Link>
              )}
              <div className="w-8 h-8 flex items-center justify-center">
                {!isOwner && (
                  <button
                    onClick={handleFavClick}
                    className="p-2 rounded-full hover:bg-[#252220] transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    {isFavorited ? (
                      <FaBookmark className="text-[#F1E9DA]" size={20} />
                    ) : (
                      <FaRegBookmark
                        className="text-[#F1E9DA]/50 hover:text-[#F1E9DA]"
                        size={20}
                      />
                    )}
                  </button>
                )}
              </div>
            </div>
            {/* Notes Section */}
            <div className="bg-[#252220]/50 backdrop-blur-sm rounded-xl border border-[#252220] overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-[#252220]/70">
                <h3 className="text-lg font-medium tracking-wide text-[#F1E9DA]">
                  NOTES
                </h3>
              </div>
              <div className="px-6 py-6 space-y-4 border-t border-[#252220]/50">
                <div>
                  <h4 className="text-[#F1E9DA] text-sm font-medium uppercase tracking-wider mb-2">
                    Title
                  </h4>
                  <p className="text-[#FBF8F4] leading-relaxed">{title}</p>
                </div>
                {link && (
                  <div>
                    <h4 className="text-[#F1E9DA] text-sm font-medium uppercase tracking-wider mb-2">
                      Link
                    </h4>
                    <Link
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-[#F1E9DA] hover:text-[#FBF8F4] transition-colors duration-300 group"
                    >
                      <span className="underline underline-offset-2 decoration-[#F1E9DA]/50 group-hover:decoration-[#FBF8F4]/70">
                        view
                      </span>
                      <FaExternalLinkAlt
                        size={12}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                )}
                {description && (
                  <div>
                    <h4 className="text-[#F1E9DA] text-sm font-medium uppercase tracking-wider mb-2">
                      Description
                    </h4>
                    <p className="text-[#FBF8F4] italic leading-relaxed">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
