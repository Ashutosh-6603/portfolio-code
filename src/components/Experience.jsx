import React from "react";
import { motion } from "framer-motion";
import resumeData from "../data/resume";

export default function Experience() {
  return (
    <section id="experience" className="py-12">
      <motion.h3
        className="text-xl font-semibold mb-6"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        Experience
      </motion.h3>
      <div className="space-y-6">
        {resumeData.experience.map((e, idx) => (
          <motion.div
            key={e.company}
            className="bg-white p-5 rounded-lg shadow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">{e.role}</h4>
                <div className="text-sm text-gray-600">
                  {e.company} • {e.period}
                </div>
              </div>
            </div>
            <ul className="mt-3 list-disc ml-5 text-gray-700">
              {e.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
