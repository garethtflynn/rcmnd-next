import React, { useState } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";

function EditListModal({ isOpen, closeModal, title, listId, isPrivate }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: title,
    listId: listId,
    isPrivate: isPrivate,
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
      router.refresh();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#252220] bg-opacity-75 z-50 flex items-center justify-center p-3">
      <div className="bg-[#000000] p-6 shadow-md w-96 rounded">
        <h2 className="text-xl font-bold mb-4 text-[#FBF8F4] text-end">
          edit list
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#000000]"
            >
              title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={title}
              onChange={handleChange}
              className="border border-[#FBF8F4] bg-transparent text-[#FBF8F4] px-2 py-1 rounded hover:bg-[#4C4138] outline-none placeholder-[#252220] w-full"
            />
          </div>
          <div className="flex my-2 self-start items-center">
            <Field className="flex my-2 text-[#14100E] self-start items-center">
              <Switch
                checked={enabled}
                onChange={handlePrivateToggle}
                className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#D7CDBF]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
              <Label className="pl-2">private</Label>
            </Field>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="w-1/2 text-[#F1E9DA] hover:text-[#14100E]"
            >
              cancel
            </button>
            <button
              type="submit"
              className={`w-1/2 ${
                loading ? "bg-[#4C4138]" : "bg-[#14100E]"
              } text-[#D7CDBF] p-2 hover:bg-[#000000] disabled:opacity-50`}
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
