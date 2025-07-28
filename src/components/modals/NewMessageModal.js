"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


function NewMessageModal({ closeModal, recipientUser, productTitle }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    content: "",
    recipientId: recipientUser?.id,
  });

  const [isLoading, setIsLoading] = useState(false);

const onSubmit = async (e) => {
  console.log("sent message!", formData);
  e.preventDefault();
  const senderId = session?.user?.id;

  if (!senderId || !formData.recipientId || !formData.content.trim()) {
    return;
  }

  setIsLoading(true);

  try {
    // First, send a product context message
    const productContextBody = {
      content: `asking about: ${productTitle}`,
      recipientId: formData.recipientId,
      senderId: senderId,
      messageType: "product_context", // Optional: to identify this as a context message
      isSystemMessage: true, // Optional: to style differently in UI
    };

    const contextRes = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productContextBody),
    });

    if (!contextRes.ok) {
      throw new Error("Failed to send product context message");
    }

    const contextData = await contextRes.json();
    const conversationId = contextData.conversationId;

    // Then send the actual user message
    const userMessageBody = {
      content: formData.content.trim(),
      recipientId: formData.recipientId,
      senderId: senderId,
      conversationId: conversationId, // Ensure it goes to the same conversation
    };

    const userRes = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userMessageBody),
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      console.log("Messages sent successfully!");
      
      // Navigate to the conversation
      router.push(`/messages/${conversationId}`);
      closeModal();
    }
  } catch (error) {
    console.log("Error sending messages:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-[#D7CDBF] bg-[#000000]">
      <div className="w-full h-2/6 flex flex-col justify-center items-center">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-[#D7CDBF]">
            Message {recipientUser?.firstName || recipientUser?.username}
          </h3>
          {productTitle && (
            <p className="text-sm text-[#D7CDBF] opacity-75 mt-1">
              About: {productTitle}
            </p>
          )}
        </div>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col items-center justify-center"
        >
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            name="content"
            placeholder="ask a question about this product..."
            rows={5}
            className="w-1/2 border border-[#D7CDBF] bg-transparent text-[#D7CDBF] px-2 py-1  my-2 rounded focus:within:bg-[#D7CDBF] outline-none placeholder-[#1E1912] resize-none"
            required
          />

          <div className="w-full flex items-center justify-center">
            <button
              onClick={closeModal}
              type="button"
              className="w-1/4 mt-2 bg-transparent hover:text-opacity-50 text-[#FBF8F4] text-opacity-75 hover:text-[#14100E] font-bold py-2 px-4 rounded-md duration-500 mr-2"
              disabled={isLoading}
            >
              cancel
            </button>
            <button
              type="submit"
              className="w-1/4 mt-2 bg-[#252220] hover:opacity-75 text-[#FBF8F4] font-bold py-2 px-4 rounded-md duration-500 disabled:opacity-50"
              disabled={isLoading || !formData.content.trim()}
            >
              {isLoading ? "sending..." : "send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewMessageModal;
