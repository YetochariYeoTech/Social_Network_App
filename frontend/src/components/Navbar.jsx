import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Menu,
  MessageCircle,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 z-40 w-full bg-base-100/80 backdrop-blur border-b border-base-300">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold">HECOM</h1>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden sm:flex gap-2 items-center text-sm">
          <Link
            to="/settings"
            className={`btn btn-sm gap-2 ${
              isActive("/settings") ? "bg-primary text-white" : ""
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          {authUser && (
            <>
              <Link
                to="/"
                className={`btn btn-sm gap-2 ${
                  isActive("/") ? "bg-primary text-white" : ""
                }`}
              >
                <User className="w-5 h-5" />
                <span>For You</span>
              </Link>
              <Link
                to="/mycollection"
                className={`btn btn-sm gap-2 ${
                  isActive("/mycollection") ? "bg-primary text-white" : ""
                }`}
              >
                <Star className="w-5 h-5" />
                <span>My collection</span>
              </Link>

              <Link
                to="/messages"
                className={`btn btn-sm gap-2 ${
                  isActive("/messages") ? "bg-primary text-white" : ""
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </Link>

              <Link
                to="/profile"
                className={`btn btn-sm gap-2 ${
                  isActive("/profile") ? "bg-primary text-white" : ""
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              <button onClick={logout} className="btn btn-sm gap-2">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="sm:hidden btn btn-ghost btn-sm"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden flex flex-col items-start px-4 py-2 gap-2 bg-base-100 border-t border-base-300"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Link
              to="/settings"
              className={`btn btn-sm w-full ${
                isActive("/settings") ? "bg-primary text-white" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>

            {authUser && (
              <>
                <Link
                  to="/"
                  className={`btn btn-sm w-full ${
                    isActive("/") ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  For You
                </Link>

                <Link
                  to="/mycollection"
                  className={`btn btn-sm w-full ${
                    isActive("/mycollection") ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  My collection
                </Link>

                <Link
                  to="/messages"
                  className={`btn btn-sm w-full ${
                    isActive("/messages") ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Link>

                <Link
                  to="/profile"
                  className={`btn btn-sm w-full ${
                    isActive("/profile") ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>

                <button onClick={logout} className="btn btn-sm w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
