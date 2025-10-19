import React from "react";

export default function CollegeLogo({ className = "", size = "large" }) {
  // Using an example SVG logo - Replace this with your actual college logo
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/logo.png" // This should match the name of your logo file
        alt="College Logo"
        className={`
          ${size === "large" ? "w-32 h-32" : "w-24 h-24"}
          object-contain
        `}
      />
    </div>
  );
}
