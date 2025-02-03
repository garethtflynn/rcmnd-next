"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { FaEllipsisVertical } from "react-icons/fa6";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import PostItem from "@/components/PostItemUserProfilePage";
import EditListModal from "@/components/EditListModal";

function ListPage() {
  const { listId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [user, setUser] = useState();
  const [list, setList] = useState();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#110A02] text-[#FBF8F4]">
        <h2>loading...</h2>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#110A02]">
      <div className="text-[#FBF8F4] px-3 py-2 flex justify-center">
        {list && (
          <div className="w-full flex justify-between items-center">

            <h1 className="text-2xl font-bold">{list.title}</h1>

            {isOwner && (
              <div className="z-50 relative">
                <Menu
                  as="div"
                  className="cursor-default bg-transparent hover:text-[#ECE2D8] duration-1000"
                >
                  <MenuButton className="text-sm font-semibold">
                    <FaEllipsisVertical
                      color="#ECE2D8"
                      size={18}
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="z-50 absolute w-40 bg-[#FBF8F4] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    style={{
                      top: "100%", 
                      right: "1rem", 
                      left: "auto", 
                      transform: "none", 
                    }}
                  >
                    <div className="py-1">
                      <MenuItem className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200">
                        <p onClick={handleEditList}>edit list</p>
                      </MenuItem>
                      <MenuItem className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200">
                        <p onClick={handleDeleteList}>delete list</p>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        <EditListModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title={list.title}
          listId={list.id}
        />
      </div>

      {/* Posts Section */}
      {posts?.length > 0 ? (
        <div className="w-full py-1 px-4 gap-4 grid grid-cols-2 md:grid-cols-3 text-[#FBF8F4]">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              title={post.title}
              src={post.image}
              alt={post.title}
              {...post}
            />
          ))}
        </div>
      ) : (
        <div className="text-[#FBF8F4] flex justify-center items-center h-full">
          <p>No posts in this list!</p>
        </div>
      )}
    </div>
  );
}

export default ListPage;
