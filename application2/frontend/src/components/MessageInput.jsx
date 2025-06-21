import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-zinc-900/80 backdrop-blur-md rounded-b-xl shadow-2xl">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 animate-fadein">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-purple-700 shadow-lg transition-transform duration-300 scale-100 hover:scale-105"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800/80 text-zinc-200 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-all duration-200"
              type="button"
              title="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-inner animate-glow"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex items-center justify-center btn btn-circle bg-zinc-800/70 hover:bg-purple-700/80 text-purple-400 border-none transition-all duration-300 shadow-md
              ${imagePreview ? "animate-pulse" : ""}
            `}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <span className="inline-block transition-transform duration-300 group-hover:rotate-12">
              <Image size={22} className="group-hover:scale-110 transition-transform duration-200" />
            </span>
          </button>
        </div>
        <button
          type="submit"
          className={`btn btn-sm btn-circle bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-white border-none shadow-lg flex items-center justify-center transition-all duration-300
            ${text.trim() || imagePreview ? "hover:scale-110 animate-bounceOnce" : "opacity-60 cursor-not-allowed"}
          `}
          disabled={!text.trim() && !imagePreview}
          title="Send"
        >
          <Send size={22} />
        </button>
      </form>
      {/* Animations */}
      <style jsx="true">{`
        @keyframes fadein {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fadein {
          animation: fadein 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 0px 0px #a78bfa44; }
          50% { box-shadow: 0 0 8px 2px #a78bfa55; }
        }
        .animate-glow:focus {
          animation: glow 1.2s infinite;
        }
        @keyframes bounceOnce {
          0% { transform: scale(1);}
          30% { transform: scale(1.18);}
          50% { transform: scale(0.95);}
          70% { transform: scale(1.08);}
          100% { transform: scale(1);}
        }
        .animate-bounceOnce:active {
          animation: bounceOnce 0.5s;
        }
      `}</style>
    </div>
  );
};
export default MessageInput;