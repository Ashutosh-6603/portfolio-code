import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      className={`w-full py-4 backdrop-blur sticky top-0 z-40 shadow-sm transition-colors duration-300 ${
        theme === "light" ? "bg-white/60" : "bg-gray-800/60"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          Ashutosh<span className="text-teal-600">.</span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="space-x-4 text-sm hidden md:block">
            <a href="#about" className="hover:text-teal-600">
              About
            </a>
            <a href="#projects" className="hover:text-teal-600">
              Projects
            </a>
            <a href="#experience" className="hover:text-teal-600">
              Experience
            </a>
            <a href="#contact" className="hover:text-teal-600">
              Contact
            </a>
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
