#!/usr/bin/env python3
"""
Build the hero portrait assets from one photo.

    python3 scripts/build-portrait.py path/to/photo.jpg [--crop X,Y,W,H] [--bg 0.9]
    python3 scripts/build-portrait.py --placeholder

Outputs (all in public/):
  portrait/mosaic.png    60x75 grayscale map the hero animates as blocks (dark = big block)
  portrait-bust.webp     480x600 head-to-shirt crop for the ID card
Best input: a head-and-shoulders photo on a plain, light background (a wall works).
The background is pushed to pure white so it disappears from the mosaic.

--placeholder draws a neutral bust silhouette so the site works before a photo exists.
Requires Pillow and numpy.
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
COLS, ROWS = 60, 75  # 4:5, matches the hero frame


def placeholder() -> Image.Image:
    w, h = 800, 1000
    img = Image.new("L", (w, h), 255)
    d = ImageDraw.Draw(img)
    # shoulders / shirt
    d.rounded_rectangle((90, 700, 710, 1150), radius=260, fill=70)
    d.polygon([(330, 700), (400, 820), (470, 700)], fill=235)  # collar opening
    # neck
    d.rounded_rectangle((330, 560, 470, 740), radius=50, fill=150)
    # head
    d.ellipse((240, 230, 560, 640), fill=165)
    # hair
    d.pieslice((228, 200, 572, 560), 180, 360, fill=40)
    d.ellipse((235, 205, 565, 380), fill=40)
    # soft shading: darker on the right side of the face
    shade = Image.new("L", (w, h), 0)
    sd = ImageDraw.Draw(shade)
    sd.ellipse((420, 300, 620, 660), fill=60)
    shade = shade.filter(ImageFilter.GaussianBlur(40))
    img = Image.fromarray(np.clip(np.asarray(img, np.int16) - np.asarray(shade, np.int16), 0, 255).astype(np.uint8))
    return img.filter(ImageFilter.GaussianBlur(4)).convert("RGB")


def whiten_background(gray: np.ndarray, bg_level: float) -> np.ndarray:
    """Levels: map the border's typical brightness to pure white, keep shadows."""
    border = np.concatenate([gray[:8].ravel(), gray[-8:].ravel(), gray[:, :8].ravel(), gray[:, -8:].ravel()])
    white = max(np.percentile(border, 50) * bg_level, 0.25)
    out = np.clip(gray / white, 0, 1)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("photo", nargs="?")
    ap.add_argument("--crop", help="X,Y,W,H in source pixels (default: centred 4:5)")
    ap.add_argument("--bg", type=float, default=0.92, help="lower = more aggressive background whitening")
    ap.add_argument("--placeholder", action="store_true")
    a = ap.parse_args()

    if a.placeholder:
        src = placeholder()
    elif a.photo:
        src = ImageOps.exif_transpose(Image.open(a.photo)).convert("RGB")
    else:
        ap.error("pass a photo path or --placeholder")

    if a.crop:
        x, y, w, h = (int(v) for v in a.crop.split(","))
        src = src.crop((x, y, x + w, y + h))
    else:
        w, h = src.size
        tw = min(w, int(h * 4 / 5))
        th = int(tw * 5 / 4)
        src = src.crop(((w - tw) // 2, 0, (w - tw) // 2 + tw, th))

    gray = np.asarray(src.convert("L"), np.float32) / 255.0
    gray = whiten_background(gray, a.bg)
    # Gentle contrast curve so the face reads as blocks.
    gray = np.clip((gray - 0.04) / 0.92, 0, 1) ** 1.15

    os.makedirs(os.path.join(PUBLIC, "portrait"), exist_ok=True)
    mosaic = Image.fromarray((gray * 255).astype(np.uint8)).resize((COLS, ROWS), Image.Resampling.LANCZOS)
    mosaic.save(os.path.join(PUBLIC, "portrait", "mosaic.png"), optimize=True)

    bust = Image.fromarray((gray * 255).astype(np.uint8)).convert("RGB").resize((480, 600), Image.Resampling.LANCZOS)
    bust.save(os.path.join(PUBLIC, "portrait-bust.webp"), "WEBP", quality=82, method=6)
    print("wrote public/portrait/mosaic.png and public/portrait-bust.webp", file=sys.stderr)


if __name__ == "__main__":
    main()
