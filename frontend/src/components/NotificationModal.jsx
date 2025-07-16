import React from 'react';

function NotificationModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center border-b border-base-300 pb-3">
          <h3 className="font-bold text-lg">{title}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
