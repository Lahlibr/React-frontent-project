import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex justify-center  items-center z-50">
      <div className=" p-6  bg-black rounded-lg max-w-5xl w-[95vw] relative">
        <button
          className="absolute top-2 right-2 text-lg font-bold  hover:text-gray-800"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
