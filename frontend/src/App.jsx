import Navbar from "./components/Navbar";

import MessagePage from "./pages/MessagePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import CollectionPage from "./pages/CollectionPage";
import PostPage from "./pages/PostPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { Provider } from "@/components/ui/provider";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  // console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <Provider>
      <div data-theme={theme} className="flex-1 w-12/12 h-full bg-base-100">
        <Navbar />

        <Routes>
          <Route
            path="/messages"
            element={authUser ? <MessagePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={authUser ? <PostPage /> : <Navigate to="/login" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/mycollection"
            element={authUser ? <CollectionPage /> : <Navigate to="/login" />}
          />
        </Routes>

        <Toaster />
      </div>
    </Provider>
  );
};
export default App;
