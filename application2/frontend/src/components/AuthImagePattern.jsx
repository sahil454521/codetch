import { useEffect, useState } from "react";
import { Moon, Stars, MessageSquare } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  const [animatedItems, setAnimatedItems] = useState([]);
  
  // Create random animation delays for a more organic feel
  useEffect(() => {
    const items = Array(9).fill().map((_, i) => ({
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      icon: i % 3 === 0 ? "moon" : i % 3 === 1 ? "stars" : "message"
    }));
    setAnimatedItems(items);
  }, []);
  
  return (
    <div className="hidden lg:flex items-center justify-center bg-zinc-900 p-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-zinc-950"></div>
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array(100).fill().map((_, i) => (
          <div 
            key={i}
            className="absolute size-1 rounded-full bg-purple-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
            }}
          />
        ))}
      </div>
      
      <div className="max-w-md text-center z-10">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {animatedItems.map((item, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-purple-500/10 backdrop-blur-sm 
                flex items-center justify-center border border-purple-500/20 
                hover:bg-purple-500/15 transition-all duration-300 group"
              style={{
                animation: `pulse ${item.duration}s infinite ${item.delay}s`,
              }}
            >
              {item.icon === "moon" && <Moon className="size-6 text-purple-400 group-hover:text-purple-300" />}
              {item.icon === "stars" && <Stars className="size-6 text-purple-400 group-hover:text-purple-300" />}
              {item.icon === "message" && <MessageSquare className="size-6 text-purple-400 group-hover:text-purple-300" />}
            </div>
          ))}
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-zinc-100">{title}</h2>
        <p className="text-zinc-400 leading-relaxed text-lg">{subtitle}</p>
        
        {/* Accent line */}
        <div className="mt-8 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-300"></div>
      </div>
      
      {/* Style for the animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;