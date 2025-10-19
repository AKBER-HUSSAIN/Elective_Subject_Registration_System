import React from "react";

export default function CollegeHeader({ type = "header", size = "default" }) {
  // Sizes: 'default', 'small'
  const headerSize = size === "small" ? "max-h-20" : "max-h-36";
  const logoSize = size === "small" ? "w-14 h-14" : "w-24 h-24";
  const padding = size === "small" ? "py-2 px-3" : "py-4 px-6";
  return (
    <div
      className={`flex items-center justify-center ${padding} bg-background rounded-2xl shadow-classic font-classic border border-primary/10`}
    >
      {type === "header" ? (
        <img
          src="/Header.jpg"
          alt="College Header"
          className={`w-full ${headerSize} object-contain rounded-xl border border-primary/20 shadow-classic`}
        />
      ) : (
        <div className="flex items-center justify-center bg-card rounded-full border-4 border-accent shadow-classic p-2">
          <img
            src="/Logo.jpg"
            alt="College Logo"
            className={`${logoSize} object-contain rounded-full`}
          />
        </div>
      )}
    </div>
  );
}
