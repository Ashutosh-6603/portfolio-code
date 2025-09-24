import React from "react";
import { motion } from "framer-motion";
import resumeData from "../data/resume";

export default function Education() {
  return (
    <section id="education" className="py-12">
      <motion.h3
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        Education
      </motion.h3>
      <motion.div
        className="bg-white p-5 rounded-lg shadow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="font-bold">{resumeData.education.school}</div>
        <div className="text-sm text-gray-600">
          {resumeData.education.degree} • CGPA: {resumeData.education.cgpa}
        </div>
      </motion.div>
    </section>
  );
}
