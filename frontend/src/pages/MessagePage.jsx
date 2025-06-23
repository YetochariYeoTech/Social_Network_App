import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black bg-opacity-40 backdrop-blur-lg p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative bg-base-100 rounded-lg shadow-lg overflow-auto
                   w-full max-w-full md:max-w-6xl max-h-[95vh] p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-red-500"
          onClick={onClose}
          aria-label="Close chat"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const MessagePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar takes full width on small screens */}
            <div className="w-full md:w-[280px] border-r border-base-300">
              <Sidebar />
            </div>

            {/* Chat area only rendered on medium+ screens */}
            {!isSmallScreen && (
              <div className="flex flex-1">
                {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* On small screens, show ChatContainer in modal */}
      {isSmallScreen && selectedUser && (
        <Modal onClose={() => setSelectedUser(null)}>
          <ChatContainer isModal />
        </Modal>
      )}
    </div>
  );
};

export default MessagePage;
