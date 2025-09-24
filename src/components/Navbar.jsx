import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      className="w-full py-4 bg-white/60 backdrop-blur sticky top-0 z-40 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          Ashutosh<span className="text-teal-600">.</span>
        </Link>
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
      </div>
    </motion.header>
  );
}
