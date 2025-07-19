"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Loading from "@/components/common/Loading";
import PostItemFavoritesPage from "@/components/posts/PostItemFavoritesPage";

function Favorites(props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [favoritePosts, setFavoritePosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUserId) {
      fetch(`/api/favorites/user/${currentUserId}`, {
        credentials: "include", // Fixed: added quotes
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          setFavoritePosts(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch favorite posts", error);
          setError(error.message);
          setIsLoading(false);
        });
    }
  }, [currentUserId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-[#000000] text-[#FBF8F4] h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">rcmnded</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000000] text-[#FBF8F4] min-h-screen p-2 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-3">rcmnded</h1>

        {!favoritePosts?.favoritePosts ||
        favoritePosts.favoritePosts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl mb-2">no favorite posts yet</h2>
            <p className="text-[#FBF8F4]/50">
              start exploring and save posts you love!
            </p>
          </div>
        ) : (
            <div className="w-full py-1 gap-4 md:grid md:grid-cols-2 text-[#F1E9DA] space-y-6 md:space-y-0">
              {favoritePosts.favoritePosts.map((post) => (
                <PostItemFavoritesPage key={post.id} post={post} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
