import React from "react";
import { motion } from "framer-motion";
import resumeData from "../data/resume";

export default function About() {
  return (
    <section id="about" className="py-16">
      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        About
      </motion.h2>
      <motion.p
        className="text-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        {resumeData.profileSummary}
      </motion.p>
    </section>
  );
}
