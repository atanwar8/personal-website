# Aryan Tanwar — portfolio

Next.js 15 / React 19 portfolio with a beige and forest-green palette and orange-and-beige mechanical skill keys.

## Run

```sh
npm ci
npm run dev
```

Open the Local URL printed by Next.js. For a production build, run `npm run build`, then `npm start`.

## Interactions

- Hero: Memoji-inspired avatar made from Aryan's supplied photo. Click to say hello; pointer movement adds a subtle tilt. The pause control stops looping animations.
- About: a four-layer tiramisu assembles as you scroll down and separates on the way back. The numbered controls and assemble/explore button also work without scrolling. The small badge flips on hover, tap, or keyboard activation.
- Skills: chunky orange and beige keycaps with a distinct icon per skill. Click a key to press it and inspect its applications. Category filters and previous/next keys expose all 40 skills. Arrow keys move within the visible keys.
- Projects: four expandable panels, shorter descriptions, and retained animated diagrams. Smart Stock AI includes an interactive restaurant purchasing example. Click the active spine, click outside, or press Escape to close.
- Experience: a branching map of internships, research, education, and projects. Scroll through years, filter categories, and select an organization for concise details. Mobile places the details below the map.
- Impact and Contact: retain the original horizontal impact sequence and contact interactions.

Reduced-motion settings disable automatic depth and looping effects. Native buttons, focus indicators, and accessible names support keyboard navigation.

## Content

`src/lib/data.ts` retains the supplied portfolio's résumé-based content. Three internships and two research roles are supported by that source. Smart Stock AI's description comes from Aryan's explanation in the chat: daily USDA scraping, Google TimesFM modeling and testing, and purchasing recommendations constrained by inventory, refrigeration, and storage. The repository link supplied by Aryan returned 404 during implementation; its code and results were not independently verified. The onion example is illustrative, not a live forecast.

## Design references

- Apple Design skill: https://github.com/dickwu/apple-design-skill
- Graph interaction reference: https://github.com/HelixDB/helix-foundry
- Keyboard, tiramisu, and avatar references supplied in the chat.

The ontology component is an original implementation inspired by the reference's connected nodes, filtering, and inspector; it does not bundle Helix Foundry. Some organization marks are website favicons; others use readable monograms or simple illustrative marks. Skill symbols are custom SVGs, alongside the original project's brand icon assets.

## Avatar generation

Generated with the built-in image-generation tool, using Aryan's photo as the identity reference and the supplied cartoon avatar as the style reference. Final prompt: “Create a stylized Apple Memoji-inspired head-and-shoulders avatar with an oversized rounded head, smooth simplified features, black sunglasses, backward sage cap, green shirt, and friendly toothy smile. Preserve the person’s likeness. Transparent background; no circle, text, or interface.”

Final asset: `public/aryan-avatar-memoji.png`.

Development and production build caches are separated (`.next-dev` / `.next`) so building does not interrupt the preview.
