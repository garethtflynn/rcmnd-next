import React, { useState } from "react";

function EditListModal({ isOpen, closeModal, title, listId }) {
  const [loading, setLoading] = useState(false);
  const [listTitle, setListTitle] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListTitle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("LIST ID", listId);
    // console.log("List Title:", title);
    // console.log("updated list title", listTitle);

    setLoading(true);
    try {
      const response = await fetch(`/api/list/${listId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listTitle),
      });
      if (!response.ok) {
        throw new Error("failed to update list");
      }
      closeModal();
    } catch (error) {
      console.error("error updating list", error);
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
          edit list
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
}

export default EditListModal;
