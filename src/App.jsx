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
import { Route, Routes } from "react-router-dom";
import Resume from "./page/Resume";
import Walk from "./page/Walk";

function ClassicLayout({ children }) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Walk />} />
      <Route
        path="/classic"
        element={
          <ClassicLayout>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Education />
            <Awards />
            <Contact />
          </ClassicLayout>
        }
      />
      <Route
        path="/resume"
        element={
          <ClassicLayout>
            <Resume />
          </ClassicLayout>
        }
      />
    </Routes>
  );
}
