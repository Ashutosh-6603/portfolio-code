import React from "react";
import { motion } from "framer-motion";
import resumeData from "../data/resume";

export default function Projects() {
  return (
    <section id="projects" className="py-12">
      <motion.h3
        className="text-xl font-semibold mb-6"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        Projects
      </motion.h3>
      <div className="grid md:grid-cols-3 gap-6">
        {resumeData.projects.map((p) => (
          <motion.a
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="block bg-white rounded-lg p-4 shadow hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-semibold mb-2">{p.title}</h4>
            <p className="text-sm text-gray-700">{p.desc}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
