import { MessageSquare, Moon, Stars } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 relative overflow-hidden">
      {/* Animated blurred blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-purple-900/30 rounded-full blur-3xl animate-blob1" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-60 h-60 bg-purple-700/20 rounded-full blur-2xl animate-blob2" />

      <div className="max-w-md text-center space-y-8 z-10">
        {/* Animated Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center shadow-xl animate-float"
            >
              <MessageSquare className="w-10 h-10 text-purple-400 animate-pop" />
              <Moon className="absolute -top-3 -left-3 w-6 h-6 text-purple-700 opacity-80 animate-spin-slow" />
              <Stars className="absolute -bottom-3 -right-3 w-6 h-6 text-purple-300 opacity-80 animate-twinkle" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-bold text-zinc-100 animate-fadein">Welcome to Lunar Chat!</h2>
        <p className="text-zinc-400 text-lg animate-fadein delay-150">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px);}
          50% { transform: translateY(-18px);}
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }
        @keyframes pop {
          0% { transform: scale(0.9);}
          50% { transform: scale(1.1);}
          100% { transform: scale(0.9);}
        }
        .animate-pop {
          animation: pop 2.5s ease-in-out infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.7;}
          50% { opacity: 1;}
        }
        .animate-twinkle {
          animation: twinkle 2.2s ease-in-out infinite;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadein {
          animation: fadein 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        @keyframes blob1 {
          0%, 100% { transform: scale(1) translateY(0);}
          50% { transform: scale(1.1) translateY(20px);}
        }
        .animate-blob1 {
          animation: blob1 8s ease-in-out infinite;
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) translateY(0);}
          50% { transform: scale(1.08) translateY(-16px);}
        }
        .animate-blob2 {
          animation: blob2 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NoChatSelected;