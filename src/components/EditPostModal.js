"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useParams } from "next/navigation";
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

  const router = useRouter();

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
    console.log("post ID", id);
    console.log("formData LIST:", formData.listId);
    console.log("formData", formData);

    setLoading(true);
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the form data as a JSON string
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      router.refresh();
      closeModal();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-[#FBF8F4] p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-[#110A02] text-center">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={title}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 text-[#110A02]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="link"
              className="block text-sm font-medium text-gray-700"
            >
              Link
            </label>
            <input
              type="text"
              id="link"
              name="link"
              defaultValue={link}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 text-[#110A02]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300  text-[#110A02]"
            />
          </div>
          <div className="mb-4">
            <select
              className="border border-gray-300 bg-transparent text-[#110A02] mt-2 px-2 py-1 focus:within:bg-[#ECE2D8] outline-none w-full block p-2"
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
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${
                loading ? "bg-gray-400" : "bg-[#4C4138]"
              } text-[#FBF8F4] p-2 rounded-md hover:bg-[#1E1912] disabled:opacity-50`}
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
