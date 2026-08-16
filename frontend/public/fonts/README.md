Drop your Sifonn font file(s) here:

- `Sifonn-Basic.woff2` (preferred — smaller, web-optimized)
- `Sifonn-Basic.otf` (fallback if you only have the desktop font)

`globals.css` already references both via `@font-face`. Nothing else needs to change — headings pick it up automatically once the file exists here (this is the `public/` folder, so it's served as-is, no rebuild required).
