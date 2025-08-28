"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaRegMessage, FaUser, FaChevronRight } from "react-icons/fa6";
import { PiPlus, PiPlusBold } from "react-icons/pi";

import { Loading } from "@/components/common";

export default function Messages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchConversations();
    }
  }, [status, router]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/messages");

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const truncateMessage = (message, maxLength = 60) => {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  if (status === "loading" || loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#000000] text-[#F1E9DA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchConversations}
            className="bg-[#252220] hover:opacity-75 text-[#FBF8F4] font-bold py-2 px-4 rounded-md duration-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#F1E9DA]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-[#F1E9DA] mb-2">messages</h1>
          {/* <PiPlusBold size={25} onClick={() => console.log('new message!')} /> */}
        </div>
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <FaRegMessage className="mx-auto text-6xl text-[#252220] mb-6" />
            <h3 className="text-xl font-medium text-[#D7CDBF] mb-2">
              no messages yet
            </h3>
            <p className="text-[#D7CDBF] opacity-75 mb-6">
              start a conversation by asking a question about a product
            </p>
            <Link
              href="/homeFeed"
              className="inline-block bg-[#252220] hover:opacity-75 text-[#FBF8F4] font-bold py-3 px-6 rounded-md duration-500"
            >
              browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block"
              >
                <div className="bg-[#252220]/30 hover:bg-[#252220]/50 border border-[#252220] rounded-lg p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Avatar/Initial */}
                      <div className="w-12 h-12 bg-[#252220] rounded-full flex items-center justify-center flex-shrink-0">
                        {conversation.otherParticipant?.firstName ? (
                          <span className="text-[#F1E9DA] font-semibold text-lg">
                            {conversation.otherParticipant.firstName
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        ) : (
                          <FaUser className="text-[#D7CDBF]" size={16} />
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-[#F1E9DA] truncate">
                            {conversation.otherParticipant?.firstName
                              ? `${conversation.otherParticipant.firstName} ${
                                  conversation.otherParticipant.lastName || ""
                                }`.trim()
                              : `@${
                                  conversation.otherParticipant?.username ||
                                  "Unknown"
                                }`}
                          </h3>
                          <span className="text-sm text-[#D7CDBF] opacity-75 flex-shrink-0 ml-2">
                            {conversation.lastMessage
                              ? formatTime(conversation.lastMessage.createdAt)
                              : formatTime(conversation.createdAt)}
                          </span>
                        </div>

                        {conversation.lastMessage ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-[#D7CDBF] opacity-75 flex-shrink-0">
                              {conversation.lastMessage.sender.id ===
                              session?.user?.id
                                ? "You:"
                                : ""}
                            </span>
                            <p className="text-sm text-[#D7CDBF] opacity-90 truncate">
                              {truncateMessage(
                                conversation.lastMessage.content
                              )}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-[#D7CDBF] opacity-75 italic">
                            no messages yet
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-[#D7CDBF] opacity-50 ml-4">
                      <FaChevronRight />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
