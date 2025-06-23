import React, { createContext, useContext, useState } from "react";

// Context to manage dialog state
const DialogContext = createContext();

export const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ children }) => {
  const { setIsOpen } = useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: () => setIsOpen(true),
  });
};

export const DialogContent = ({ children }) => {
  const { isOpen, setIsOpen } = useContext(DialogContext);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold mb-4">{children}</h2>
);
