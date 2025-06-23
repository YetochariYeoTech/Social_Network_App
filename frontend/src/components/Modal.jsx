const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-primary bg-opacity-40 backdrop-blur-lg p-6 md:p-12"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-lg shadow-lg overflow-auto
                   max-w-6xl w-full max-h-[95vh] p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
