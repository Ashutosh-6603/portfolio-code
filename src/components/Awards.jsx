import React from "react";
import { motion } from "framer-motion";
import resumeData from "../data/resume";

export default function Awards() {
  return (
    <section id="awards" className="py-12">
      <motion.h3
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        Awards
      </motion.h3>
      <div className="grid gap-3">
        {resumeData.awards.map((a, i) => (
          <motion.div
            key={i}
            className="bg-white p-4 rounded-lg shadow flex gap-3 items-start"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-3xl">🏆</div>
            <div>
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm text-gray-700">{a.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
