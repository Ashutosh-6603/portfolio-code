import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Awards from "./components/Awards";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Resume from "./page/Resume";

export default function App() {
  const location = useLocation();

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6">
        {location.pathname === "/" && (
          <>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Education />
            <Awards />
            <Contact />
          </>
        )}
        <Routes>
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
