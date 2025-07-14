"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { FaEllipsis } from "react-icons/fa6";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import {
  PostItemUserProfilePage,
  PostItemYourProfilePage,
} from "@/components/posts";
import { Loading } from "@/components/common";
import { AddPostModal, EditListModal } from "@/components/modals";

function ListPage() {
  const { listId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [user, setUser] = useState();
  const [list, setList] = useState();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openAddpost = () => setIsAddPostModalOpen(true);
  const closeAddpost = () => setIsAddPostModalOpen(false);

  useEffect(() => {
    if (listId) {
      fetch(`/api/list/${listId}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          // console.log(data.userId);
          // console.log(data.userId);
          // console.log(data.posts);
          setList(data);
          setUser(data.userId);
          setPosts(data.posts);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch posts", error);
          setIsLoading(false);
        });
    }
  }, [listId]);

  const isOwner = user === session?.user?.id;

  const handleEditList = () => {
    openModal();
  };

  const handleDeleteList = async () => {
    try {
      // Sending a DELETE request to the API
      const response = await fetch(`/api/list/${listId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete list");
      }

      console.log(`List with ID ${listId} deleted.`);
      router.push("/profilePage");
    } catch (error) {
      console.error("Error deleting post:", error);
      // You might want to show an error message to the user
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Sending a DELETE request to the API
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // If the API call is successful, update the UI (remove the post from the state)
      setPosts(posts.filter((post) => post.id !== postId));

      // console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting post:", error);
      // You might want to show an error message to the user
    }
  };

  const handleAddPost = async () => {
    openAddpost();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="text-[#FBF8F4] px-3 py-2 flex justify-center">
        {list && (
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold">{list.title}</h1>

            {isOwner && (
              <div className="z-50 relative">
                <Menu
                  as="div"
                  className="cursor-default bg-transparent hover:text-[#D7CDBF] duration-1000"
                >
                  <MenuButton className="text-sm font-semibold">
                    <FaEllipsis
                      color="#FBF8F4"
                      size={17}
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="z-50 absolute w-40 bg-[#000000]  transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    style={{
                      top: "100%",
                      right: "1rem",
                      left: "auto",
                      transform: "none",
                    }}
                  >
                    <div className="py-1">
                      <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] hover:opacity-25 font-semibold">
                        <p onClick={handleEditList}>edit list</p>
                      </MenuItem>
                      <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] hover:opacity-25 font-semibold">
                        <p onClick={handleAddPost}>add post</p>
                      </MenuItem>
                      <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] hover:opacity-25 font-semibold">
                        <p onClick={handleDeleteList}>delete list</p>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            )}
          </div>
        )}

        <EditListModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title={list.title}
          listId={list.id}
          isPrivate={list.isPrivate}
        />

        <AddPostModal
          isOpen={isAddPostModalOpen}
          closeModal={closeAddpost}
          listId={listId}
          listTitle={list.title}
        />
      </div>

      {/* Posts Section */}
      {posts?.length > 0 ? (
        <div className="w-full py-1 px-4 gap-4 grid grid-cols-2 md:grid-cols-3 text-[#D7CDBF]">
          {posts.map((post) =>
            isOwner ? ( // Check if the current user is the owner of the post
              <PostItemYourProfilePage
                key={post.id}
                title={post.title}
                href={`/post/${post.id}`}
                src={post.image}
                alt={post.title}
                list={post.list?.title}
                deletePostCallback={handleDeletePost}
                {...post} // Passing other props that are needed for the post
              />
            ) : (
              <PostItemUserProfilePage
                key={post.id}
                title={post.title}
                href={`/post/${post.id}`}
                src={post.image}
                alt={post.title}
                list={post.list?.title}
                {...post} // Passing other props for a regular post (no edit/delete)
              />
            )
          )}
        </div>
      ) : (
        <div className="text-[#D7CDBF] flex justify-center items-center h-full">
          <p>No posts in this list!</p>
        </div>
      )}
    </div>
  );
}

export default ListPage;
