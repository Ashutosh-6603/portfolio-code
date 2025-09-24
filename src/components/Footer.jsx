import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 py-6 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Ashutosh Patro. Built with React.
      </div>
    </footer>
  );
}
