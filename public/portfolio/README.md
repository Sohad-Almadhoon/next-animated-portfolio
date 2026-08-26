# Project screenshots

Drop screenshots into the folder named after the project slug. The portfolio
page reads each folder at build time and feeds the gallery automatically —
no code change needed.

    public/portfolio/
      car4sales/   1.png  2.png  3.png ... 15.png
      proshop/     1.png  2.png ...
      fiverr/
      carepulse/
      bookshop/

Rules:
- Any of .png .jpg .jpeg .webp .avif .gif
- Sorted numerically, so 2.png comes before 10.png
- `1` is the cover shown on the panel
- Any number of files works; 10-15 per project is the sweet spot. The panel
  rail shows the first 7 and collapses the rest into a "+N" tile
- An empty folder falls back to the single legacy cover in `lib/portfolio.ts`

Tips:
- Capture at 1600x1000 (16:10) so the browser frame crops cleanly
- Keep each file under ~400 KB (convert to .webp if needed)
- Order them as a story: landing -> core feature -> dashboard -> checkout -> mobile
