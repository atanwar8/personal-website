# Aryan Tanwar — Portfolio

**Live site:** [aryan-portfolio-vert.vercel.app](https://aryan-portfolio-vert.vercel.app)

The personal portfolio of Aryan Tanwar, an MSIS candidate at Indiana University's Kelley School of
Business (December 2026). It tells the story of a career in information systems, analytics and AI
through one idea: *good strategy, like good food, is all about the ingredients.*

Built with Next.js 15, React 19 and TypeScript. Fully static, deployed on Vercel.

---

## What's on the page

| Section | What it does |
| --- | --- |
| **Hero** | A memoji avatar that ripples apart into coloured blocks, spells **YO** and **AT**, and pops back into the photo with a bubble effect. Click it to send a ripple. A pause button stops all looping motion. |
| **About** | A tiramisu that builds itself layer by layer as you scroll, with a callout for each layer (the base, the middle, the flavor, the finish). A swinging lanyard ID badge flips on hover to reveal three facts. |
| **Skills** | A mechanical keyboard of 40 skills. Press a key to see its logo and a one-line story of where it was used. Filters by family. On phones it becomes swipeable tabs with a bottom-sheet pop-up. |
| **Work** | Four projects (Grainger, Toyota Material Handling, Allianz Life × EY, Smart Stock AI) that open on hover, each with a small animated diagram. Smart Stock AI links to the full research report. |
| **Experience** | A scrolling timeline from Edelweiss to graduation, with company logos that light up as you pass them. It ends with the avatar swapping his cap for a graduation cap. |
| **Impact** | "By the numbers": cards that slide sideways as you scroll and count up their figures. |
| **Contact** | Email (with copy), phone, LinkedIn and the résumé download. |

Sections stack like a deck of cards: each new section slides up over the last.

## Tech stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, every page pre-rendered as static HTML), React 19, TypeScript
- **Styling:** Tailwind CSS v4 plus component-scoped CSS
- **Motion:** [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling, Canvas 2D for the avatar, CSS and SVG for everything else
- **Type:** Inter Tight, Instrument Serif and JetBrains Mono (self-hosted via Fontsource)
- **Icons:** brand marks from [Simple Icons](https://simpleicons.org) (CC0) and hand-drawn SVG line icons
- **Hosting:** [Vercel](https://vercel.com)

No backend, database, forms or tracking. The page is pre-rendered HTML, CSS and JavaScript.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # lint
```

## Project structure

```
src/
├── app/                  # layout, page, global styles, icon
├── components/
│   ├── App.tsx           # page shell and the stacked "deck" of sections
│   ├── Navigation.tsx    # floating nav pill and mobile menu
│   ├── hero/             # avatar canvas animation and hero copy
│   ├── sections/         # About, Badge, Skills, Work, Experience, Impact, Contact
│   └── ui/               # skill and brand icons
├── lib/
│   ├── data.ts           # all content: profile, skills, projects, experience, numbers
│   ├── hooks.ts          # reduced-motion, pause and scroll-progress hooks
│   └── scroll.tsx        # deck scrolling, smooth scroll and section stacking
public/
├── avatar/               # avatar layers for the graduation animation
├── organizations/        # company and school logos
├── logos/                # tool brand marks
└── *.pdf                 # résumé and the Smart Stock AI research report
```

Almost all copy lives in [`src/lib/data.ts`](src/lib/data.ts), so content updates rarely need to touch a component.

## Accessibility

- Respects **Reduce Motion**: animations settle into their final state, and a pause button stops looping motion for everyone.
- Keyboard friendly, with a skip link, visible focus rings, and arrow-key navigation on the skill keyboard.
- Text meets WCAG contrast minimums (checked against Apple's Human Interface Guidelines).
- Every interactive element has a text label for screen readers.

## Deploy

The site is deployed to Vercel:

```bash
npx vercel deploy --prod
```

## Credits

Company and school logos are trademarks of their respective owners and are used only to identify
where the work took place. Brand icons come from Simple Icons (CC0).

© 2026 Aryan Tanwar
