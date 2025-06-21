import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 relative">
      {/* Decorative blurred gradient blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-purple-900/30 rounded-full blur-3xl z-0" />
      <div className="pointer-events-none absolute bottom-10 right-0 w-60 h-60 bg-purple-700/20 rounded-full blur-2xl z-0" />

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
        {messages.map((message, idx) => {
          const isMine = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`flex items-end ${isMine ? "justify-end" : "justify-start"} group`}
              ref={idx === messages.length - 1 ? messageEndRef : null}
            >
              {!isMine && (
                <div className="mr-3">
                  <div className="size-10 rounded-full border-2 border-zinc-800 shadow-lg">
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      alt="profile pic"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}

              <div
                className={`
                  max-w-xs sm:max-w-md px-4 py-3 rounded-2xl shadow-lg
                  ${isMine
                    ? "bg-gradient-to-br from-purple-700/80 to-purple-500/70 text-zinc-100 rounded-br-md"
                    : "bg-zinc-800/80 text-zinc-200 rounded-bl-md border border-zinc-700/40"}
                  backdrop-blur-md transition-all duration-200
                  relative
                `}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xs text-zinc-400">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 border border-zinc-700"
                  />
                )}
                {message.text && <p className="break-words">{message.text}</p>}
              </div>

              {isMine && (
                <div className="ml-3">
                  <div className="size-10 rounded-full border-2 border-purple-700 shadow-lg">
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="profile pic"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="z-10">
        <MessageInput />
      </div>
    </div>
  );
};
export default ChatContainer;