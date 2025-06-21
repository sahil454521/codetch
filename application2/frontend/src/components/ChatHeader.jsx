import { X, PhoneCall, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-3 border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="size-10 rounded-full ring-2 ring-zinc-800 overflow-hidden">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="object-cover w-full h-full"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-3 bg-purple-500 
                rounded-full ring-2 ring-zinc-900" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-zinc-100">{selectedUser.fullName}</h3>
            <p className={`text-xs ${isOnline ? "text-purple-400" : "text-zinc-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button 
            className="text-zinc-400 hover:text-purple-400 transition-colors p-1.5 rounded-full 
            hover:bg-zinc-800"
            title="Call"
          >
            <PhoneCall size={18} />
          </button>
          
          <button 
            className="text-zinc-400 hover:text-purple-400 transition-colors p-1.5 rounded-full 
            hover:bg-zinc-800"
            title="Video call"
          >
            <Video size={18} />
          </button>
          
          <button 
            className="text-zinc-400 hover:text-purple-400 transition-colors p-1.5 rounded-full 
            hover:bg-zinc-800"
            title="More options"
          >
            <MoreVertical size={18} />
          </button>
          
          {/* Close button */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="ml-2 text-zinc-400 hover:text-red-400 transition-colors p-1.5 rounded-full 
            hover:bg-zinc-800"
            title="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;