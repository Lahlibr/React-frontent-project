// src/components/ui/card.js
import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border">
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

export { Card, CardContent };
