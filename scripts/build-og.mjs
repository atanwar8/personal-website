// Renders public/og.jpg (1200×630) from the live hero. Run with the site on :3000 (npm run dev / start):
//   node scripts/build-og.mjs [url]
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:3000/";
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.addStyleTag({ content: ".nav, .nav-progress, .hero-still, .hero-bubble { display: none !important; }" });
await page.waitForTimeout(3200);
await page.screenshot({ path: "public/og.jpg", type: "jpeg", quality: 86 });
await browser.close();
console.log("wrote public/og.jpg");
