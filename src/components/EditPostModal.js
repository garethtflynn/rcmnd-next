"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const EditPostModal = ({
  isOpen,
  closeModal,
  id,
  title,
  link,
  description,
  list,
  listId,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;


  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState(null);
  const [formData, setFormData] = useState({
    postId: id,
    title: title,
    link: link,
    description: description,
    listId: listId,
  });

  useEffect(() => {
    if (userId) {
      const fetchLists = async () => {
        try {
          const res = await fetch(`/api/lists/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!res.ok) {
            // console.log("RES IN userTest", res);
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
          //   console.log(data);
          setLists(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the form data as a JSON string
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      closeModal();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-[#4C4138] p-6 shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-[#110A02] text-end">
          edit post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#110A02]"
            >
              title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={title}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-[#1E1912] text-[#1E1912] bg-[#4C4138]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="link"
              className="block text-sm font-medium text-[#110A02]"
            >
              link
            </label>
            <input
              type="text"
              id="link"
              name="link"
              defaultValue={link}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-[#1E1912] text-[#1E1912] bg-[#4C4138]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#110A02]"
            >
              description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-[#1E1912] text-[#1E1912] bg-[#4C4138]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="list"
              className="block text-sm font-medium text-[#110A02]"
            >
              list
            </label>
            <select
              className="border border-[#1E1912] bg-transparent text-[#1E1912] mt-2 px-2 py-1 focus:within:bg-[#ECE2D8] outline-none w-full block p-2"
              onChange={(e) =>
                setFormData({ ...formData, listId: e.target.value })
              }
            >
              <option>{list}</option>
              {lists?.map((list) => {
                return (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-4 text-[#110A02] hover:text-[#1E1912]"
            >
              cancel
            </button>
            <button
              type="submit"
              className={`w-1/2 ${
                loading ? "bg-[#4C4138]" : "bg-[#1E1912]"
              } text-[#ECE2D8] p-2 hover:bg-[#110A02] disabled:opacity-50`}
              disabled={loading}
            >
              {loading ? "saving..." : "save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
