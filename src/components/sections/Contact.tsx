"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

function HopLine({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <span className={`hop-line${accent ? " accent" : ""}`} aria-hidden="true">
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i} className="hop-sp">
            {" "}
          </span>
        ) : (
          <span key={i} className="hop">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" data-card className="deck-card contact" aria-labelledby="contact-title">
      <div className="wrap section ct">
        <h2 id="contact-title" className="ct-h" aria-label="Let's build something together.">
          <HopLine text="Let's build" />
          <HopLine text="something together." accent />
        </h2>

        <div className="ct-row">
          <div className="ct-mail rv">
            <a className="ct-email" href={`mailto:${PROFILE.email}`}>
              {PROFILE.email}
            </a>
            <button type="button" className="chip ct-copy" onClick={copy} aria-label="Copy email address">
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied" : ""}
            </span>
          </div>

          {/* Decorative duplicate of the email link above, so it stays out of the tab order and the a11y tree. */}
          <a className="ct-badge" href={`mailto:${PROFILE.email}`} aria-hidden="true" tabIndex={-1}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1 -92 0" />
              </defs>
              <text>
                {/* textLength = the circle's circumference (2π·46), so the loop closes exactly. */}
                <textPath href="#ct-circle" textLength="289" lengthAdjust="spacing">
                  say hello · say hello · say hello ·
                </textPath>
              </text>
            </svg>
            <span className="ct-badge-arr" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <ul className="ct-links rv">
          <li>
            <span className="mono">Phone</span>
            <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
          </li>
          <li>
            <span className="mono">LinkedIn</span>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
              {PROFILE.linkedinLabel} <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>

        <footer className="ct-foot mono">
          <span>
            © {new Date().getFullYear()} {PROFILE.name}
          </span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("top");
            }}
          >
            Back to top ↑
          </a>
        </footer>
      </div>

      <style href="contact" precedence="default">{`
        .ct { display: flex; flex-direction: column; min-height: calc(100svh - var(--deck-inset) * 2); padding-bottom: 32px; }
        .ct-h { margin: 22px 0 0; font-size: clamp(3rem, 9.4vw, 9.5rem); font-weight: 700; letter-spacing: -0.055em; line-height: .95; }
        .hop-line { display: block; }
        .hop-line.accent { color: var(--mute); }
        .hop { display: inline-block; transition: transform .5s var(--ease); }
        .hop:hover { animation: hop .6s var(--ease); }
        @keyframes hop { 0% { transform: none; } 35% { transform: translateY(-0.16em); } 65% { transform: translateY(.03em); } 100% { transform: none; } }
        .hop-sp { display: inline-block; width: .26em; }

        .ct-row { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: clamp(32px, 6vh, 64px); flex-wrap: wrap; }
        .ct-mail { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; min-width: 0; }
        .ct-email {
          font-size: clamp(1.625rem, 4vw, 3.5rem); font-weight: 600; letter-spacing: -0.04em; overflow-wrap: anywhere;
          background: linear-gradient(currentColor, currentColor) 0 100% / 100% 2px no-repeat; padding-bottom: 4px;
          transition: background-size .6s var(--ease);
        }
        .ct-email:hover { background-size: 0 2px; background-position: 100% 100%; }
        .ct-copy { height: 36px; padding: 0 16px; cursor: pointer; transition: background-color .4s var(--ease), color .4s var(--ease); }
        .ct-copy:hover { background: var(--ink); color: #fff; }
        .ct-badge { position: relative; display: grid; place-items: center; width: 132px; height: 132px; border-radius: 50%; flex: none; }
        .ct-badge svg { position: absolute; inset: 0; animation: spin 18s linear infinite; }
        .ct-badge text { font: 500 11.5px var(--font-jetbrains-mono), monospace; text-transform: uppercase; fill: var(--ink); }
        .ct-badge-arr {
          display: grid; place-items: center; width: 58px; height: 58px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 1.375rem;
          transition: transform .6s var(--ease);
        }
        .ct-badge:hover .ct-badge-arr { transform: rotate(45deg) scale(1.06); }
        @keyframes spin { to { transform: rotate(360deg); } }

        .ct-links { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; list-style: none; margin: clamp(36px, 7vh, 72px) 0 0; padding: 0; border-top: 1px solid var(--line); }
        .ct-links li { display: flex; flex-direction: column; gap: 8px; padding: 22px 20px 22px 0; }
        .ct-links li + li { padding-left: 20px; border-left: 1px solid var(--line); }
        .ct-links .mono { font-size: 0.6875rem; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
        .ct-links a { font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.01em; width: fit-content; }
        .ct-links a:hover { text-decoration: underline; text-underline-offset: 4px; }
        .ct-foot { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: auto; padding-top: 48px; font-size: 0.75rem; color: var(--mute); }
        .ct-foot a:hover { color: var(--ink); }
        @media (max-width: 760px) {
          .ct-links { grid-template-columns: 1fr; }
          .ct-links li + li { padding-left: 0; border-left: 0; border-top: 1px solid var(--line); }
          .ct-badge { width: 112px; height: 112px; }
        }
      `}</style>
    </section>
  );
}
