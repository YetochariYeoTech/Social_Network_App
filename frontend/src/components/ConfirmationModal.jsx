import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto text-center">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <div className="py-4 text-base-content/80">
          {children}
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
