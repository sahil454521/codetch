import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Moon, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-zinc-900 border-b border-zinc-800 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-zinc-900/90"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all group">
              <div className="size-9 rounded-lg bg-purple-500/10 flex items-center justify-center 
                group-hover:bg-purple-500/20 transition-colors">
                <Moon className="size-5 text-purple-400" />
              </div>
              <h1 className="text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">Lunar Chat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className={`
                px-3 py-2 rounded-lg flex items-center gap-2 transition-all
                text-zinc-400 hover:text-purple-300 bg-zinc-800/50 hover:bg-zinc-800 
                border border-zinc-700/50 hover:border-purple-500/30
              `}
            >
              <Settings className="size-4" />
              <span className="hidden sm:inline text-sm font-medium">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link 
                  to={"/profile"} 
                  className={`
                    px-3 py-2 rounded-lg flex items-center gap-2 transition-all
                    text-zinc-400 hover:text-purple-300 bg-zinc-800/50 hover:bg-zinc-800 
                    border border-zinc-700/50 hover:border-purple-500/30
                  `}
                >
                  <User className="size-4" />
                  <span className="hidden sm:inline text-sm font-medium">Profile</span>
                </Link>

                <button 
                  onClick={logout}
                  className={`
                    px-3 py-2 rounded-lg flex items-center gap-2 transition-all
                    text-zinc-400 hover:text-red-400 bg-zinc-800/50 hover:bg-zinc-800 
                    border border-zinc-700/50 hover:border-red-500/30
                  `}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </>
            )}

            {/* User avatar - if you want to add this */}
            {authUser && (
              <div className="ml-2 relative group">
                <div className="size-9 rounded-full overflow-hidden border-2 border-zinc-800 
                  group-hover:border-purple-500/30 transition-colors">
                  <img 
                    src={authUser.profilePic || "/avatar.png"} 
                    alt={authUser.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-48 
                  bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-zinc-700">
                    <p className="font-medium text-zinc-200">{authUser.fullName}</p>
                    <p className="text-xs text-zinc-400 truncate">{authUser.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-2 p-2 rounded-md text-zinc-300 
                      hover:bg-zinc-700 w-full text-left text-sm">
                      <User className="size-4" />
                      My Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 p-2 rounded-md text-zinc-300 
                      hover:bg-zinc-700 w-full text-left text-sm">
                      <Settings className="size-4" />
                      Settings
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 p-2 rounded-md text-zinc-300 
                      hover:bg-zinc-700 w-full text-left text-sm">
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;