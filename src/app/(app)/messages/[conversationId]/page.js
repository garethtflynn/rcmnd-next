"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaUser } from "react-icons/fa6";
import { PiPaperPlaneTilt } from "react-icons/pi";

import { Loading } from "@/components/common";

export default function ConversationPage({ params }) {
  const { conversationId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  const fetchConversation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Conversation not found");
        } else if (response.status === 403) {
          setError("Access denied");
        } else {
          setError("Failed to load conversation");
        }
        return;
      }

      const data = await response.json();
      setConversation(data.conversation);
      setMessages(data.conversation.messages || []);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setError("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const setupRealtimeConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `/api/conversations/${conversationId}/stream`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_message") {
        // Avoid duplicating messages - only add if it's not already in the list
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) =>
              msg.id === data.message.id ||
              (msg.isTemporary &&
                msg.content === data.message.content &&
                msg.senderId === data.message.senderId)
          );

          if (messageExists) {
            // Replace temporary message with real one, or skip if already exists
            return prev.map((msg) =>
              msg.isTemporary &&
              msg.content === data.message.content &&
              msg.senderId === data.message.senderId
                ? { ...data.message, isTemporary: false }
                : msg
            );
          } else {
            // Add new message
            return [...prev, data.message];
          }
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        if (status === "authenticated") {
          setupRealtimeConnection();
        }
      }, 5000);
    };
  }, [conversationId, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchConversation();
      setupRealtimeConnection();
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [status, fetchConversation, setupRealtimeConnection, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      });

      if (response.ok) {
        const data = await response.json();

        setMessages((prev) => [...prev, data.messageData]);
      }
    } catch (error) {
      console.error("Send message error:", error);
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

    const formatMessageTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatMessageDate = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    };

    const shouldShowDateSeparator = (currentMessage, prevMessage) => {
    if (!prevMessage) return true;

    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const prevDate = new Date(prevMessage.createdAt).toDateString();

    return currentDate !== prevDate;
  };

  const renderMessage = (message, index, isOwnMessage, showDateSeparator) => {
    // Check type of message
    if (message.messageType === "product_context" || message.isSystemMessage) {
      return (
        <>
          {/* Date Separator */}
          {showDateSeparator && (
            <div className="flex items-center justify-center py-4">
              <div className="bg-[#252220] text-[#D7CDBF] text-xs px-3 py-1 rounded-full">
                {formatMessageDate(message.createdAt)}
              </div>
            </div>
          )}

          {/* Product Context Message */}
          <div className="flex justify-center py-2">
            <div className="bg-gradient-to-r from-[#252220] to-[#3a3632] border border-[#D7CDBF]/20 text-[#D7CDBF] text-sm px-4 py-3 rounded-lg max-w-md text-center shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">📦</span>
                <span className="font-medium">
                  {message.content.replace("📦 Product Discussion: ", "")}
                </span>
              </div>
              <p className="text-xs text-[#D7CDBF]/70 mt-1">
                {formatMessageTime(message.createdAt)}
              </p>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {/* Date Separator */}
        {showDateSeparator && (
          <div className="flex items-center justify-center py-4">
            <div className="bg-[#252220] text-[#D7CDBF] text-xs px-3 py-1 rounded-full">
              {formatMessageDate(message.createdAt)}
            </div>
          </div>
        )}

        {/* Regular Message */}
        <div
          className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
              isOwnMessage
                ? "bg-[#D7CDBF] text-[#000000] rounded-br-md"
                : "bg-[#252220] text-[#F1E9DA] rounded-bl-md"
            } ${message.isTemporary ? "opacity-70" : ""}`}
          >
            <p className="break-words">{message.content}</p>
            <div className="flex items-center justify-between">
              <p
                className={`text-xs mt-1 ${
                  isOwnMessage ? "text-[#000000]/70" : "text-[#D7CDBF]/70"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </p>
              {message.isTemporary && (
                <div className="ml-2">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isOwnMessage ? "bg-[#000000]/40" : "bg-[#D7CDBF]/40"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  if (status === "loading" || loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#000000] text-[#F1E9DA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            href="/messages"
            className="bg-[#252220] hover:opacity-75 text-[#FBF8F4] font-bold py-2 px-4 rounded-md duration-500"
          >
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation?.otherParticipant;

  return (
    <div className="h-screen w-full bg-[#000000] text-[#F1E9DA] flex flex-col">
      {/* Header */}
      <div className="bg-[#252220]/50 border-b border-[#252220] px-4 py-4 flex items-center space-x-4">
        <Link
          href="/messages"
          className="p-2 hover:bg-[#252220] rounded-full transition-colors duration-300"
        >
          <FaArrowLeft className="text-[#D7CDBF]" size={18} />
        </Link>

        <div className="flex items-center space-x-3">
          <div>
            <h2 className="font-semibold text-[#F1E9DA]">
              {otherParticipant?.firstName
                ? `${otherParticipant.firstName} ${
                    otherParticipant.lastName || ""
                  }`.trim()
                : `@${otherParticipant?.username || "Unknown"}`}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#D7CDBF] opacity-75">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.senderId === session?.user?.id;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showDateSeparator = shouldShowDateSeparator(
              message,
              prevMessage
            );

            // Use message.id as key, fallback to index if no id
            const key = message.id || `message-${index}`;

            return (
              <div key={key}>
                {renderMessage(message, index, isOwnMessage, showDateSeparator)}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-[#252220]/50 border-t border-[#252220] p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#000000] border border-[#252220] rounded-full px-4 py-3 text-[#F1E9DA] placeholder-[#D7CDBF]/50 focus:outline-none focus:border-[#D7CDBF] transition-colors duration-300"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-[#D7CDBF] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-[#000000] p-3 rounded-full transition-all duration-300"
          >
            <PiPaperPlaneTilt size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
