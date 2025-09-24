import React from "react";
import { motion } from "framer-motion";
import resumeData from "../data/resume";

export default function Skills() {
  return (
    <section id="skills" className="py-12">
      <motion.h3
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        Skills
      </motion.h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {resumeData.skills.map((s, i) => (
          <motion.div
            key={s}
            className="p-3 bg-white rounded-lg shadow-sm text-center text-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {s}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
