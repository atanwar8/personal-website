"use client";

import { useEffect } from "react";
import { useDeck } from "@/lib/scroll";
import { restoreStill } from "@/lib/hooks";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Impact from "./sections/Impact";
import Contact from "./sections/Contact";

function useRevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    // The hero is on screen at load, so reveal it straight away (its bottom row sits inside the
    // observer's bottom margin and would otherwise wait for a scroll).
    const raf = requestAnimationFrame(() =>
      document.querySelectorAll("#top .rv, #top .rv-mask").forEach((el) => el.classList.add("is-in")),
    );
    document.querySelectorAll(".rv, .rv-mask").forEach((el) => {
      if (!el.closest("#top")) io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);
}

export default function App() {
  useDeck();
  useRevealObserver();
  useEffect(restoreStill, []);
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Navigation />
      <main id="main" className="deck" data-deck>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Impact />
        <Contact />
      </main>
      <style href="app" precedence="default">{`
        .skip {
          position: fixed; left: 12px; top: 12px; z-index: 100;
          padding: 10px 16px; border-radius: 999px; background: var(--ink); color: #fff;
          transform: translateY(-160%); transition: transform .3s var(--ease);
        }
        .skip:focus { transform: none; }
      `}</style>
    </>
  );
}
