import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-12">
      <motion.h3
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        Contact
      </motion.h3>
      <motion.div
        className="bg-white p-6 rounded-lg shadow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <p className="text-gray-700">
          Email:{" "}
          <a href="mailto:ashutosh6603@gmail.com" className="text-teal-600">
            ashutosh6603@gmail.com
          </a>
        </p>
        <p className="text-gray-700 mt-1">
          Phone:{" "}
          <a href="tel:+918249700335" className="text-teal-600">
            +91 82497 00335
          </a>
        </p>
        <p className="text-gray-700 mt-3">
          LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/ashutosh-patro-1a94272a7/"
            target="_blank"
            rel="noreferrer"
            className="text-teal-600"
          >
            View Profile
          </a>
        </p>
      </motion.div>
    </section>
  );
}
