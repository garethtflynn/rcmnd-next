import React, { useState } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import { AddPostForm } from "../forms";

function AddPostModal({
  isOpen,
  closeModal,
  title,
  link,
  description,
  image,
  listId,
  listTitle,
  isPrivate,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    image: "",
    listId: listId,
    isPrivate: false,
  });
  const [enabled, setEnabled] = useState(isPrivate);

  const handlePrivateToggle = (checked) => {
    setEnabled(checked);
    // Update the formData when the switch is toggled
    setFormData((prevData) => ({
      ...prevData,
      isPrivate: checked, // Set isPrivate to the value of the switch
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("LIST ID", listId);
    // console.log("List Title:", title);
    // console.log("updated list title", listTitle);
    // console.log(formData)

    setLoading(true);
    try {
      const response = await fetch(`/api/list/${listId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="fixed inset-0 bg-[#252220] bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#000000] p-6 shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl rounded-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-1 text-[#FBF8F4] text-end">
          add post to list
        </h2>
        <AddPostForm
          closeModal={closeModal}
          listId={listId}
          listTitle={listTitle}
        />
      </div>
    </div>
  );
}

export default AddPostModal;
