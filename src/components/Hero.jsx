import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-bg py-20">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hi, I’m Ashutosh Patro
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Full Stack Software Developer — building scalable web applications
          with React, Node.js, and GraphQL.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/resume"
            className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:scale-[1.02]"
          >
            View Resume
          </Link>
          <a
            href="#contact"
            className="px-5 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  );
}
