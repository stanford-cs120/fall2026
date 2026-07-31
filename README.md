# cs120_website

Website for CS120 - Introduction to AI Safety (Autumn 2026).
Served via GitHub Pages: https://stanford-cs120.github.io/fall2026/

## Repo layout

```
index.html                    Course landing page (Bootstrap static site)
style.css                     Site styles
images/                       Site images (logo, sticker, headshot)
finalproject_template_latex/  LaTeX template for the final project
sfig/                         Vendored sfig presentation library (Percy Liang),
                              copied byte-identical from the CS 221 Spring 2026 repo.
                              Pure client-side JS; no build step, no dependencies.
lectures/                     sfig-based lecture decks
  lecture.html                Generic loader; open with ?lecture=NAME (default: mock)
  utils.js                    Shared helpers ported from CS 221 (add, prose,
                              titleSlide, outlineSlide); CS120 footer/title/logo
  mock.js                     Setup-verification deck (math, builds, prose notes).
                              Not a course lecture; intentionally unlinked.
  images/                     Slide-helper images (roadmap signpost etc.)
  pdf/                        Generated lecture PDFs (gitignored by default)
```

## Authoring lectures

- One `NAME.js` file per lecture in `lectures/`, loaded via
  `lectures/lecture.html?lecture=NAME`.
- Speaker notes are `prose()` blocks after each slide; they render alongside
  slides in print mode (`#mode=print1pp`) and are hidden in fullscreen
  (shift-F). The same source file therefore doubles as lecture notes.
- sfig reads its own parameters (`mode`, slide index) from the **hash
  fragment**, not the query string: `?lecture=NAME#mode=print1pp`.
- Math uses MathJax. Inside JS single-quoted strings, LaTeX backslashes must be
  doubled (`\\frac`, `\\text`), since `\t`/`\f` are JS escapes.
- Local preview: `python3 -m http.server 8000` from the repo root, then open
  `http://localhost:8000/lectures/lecture.html?lecture=mock`.
  (Serving over HTTP avoids MathJax font strict-origin issues with `file://`.)

## PDF export (headless Chrome; no node required)

```bash
# from the repo root, with the HTTP server running:
google-chrome --headless=new --no-sandbox --disable-gpu \
  --virtual-time-budget=30000 \
  --print-to-pdf=lectures/pdf/<name>-1pp.pdf \
  "http://localhost:8000/lectures/lecture.html?lecture=<name>#mode=print1pp"
```

- `print1pp`: full-size slides with facing prose notes (lecture-notes PDF).
- `print6pp`: compact handout layout.
- Generated PDFs live in `lectures/pdf/`, ignored by default; publishing a
  lecture's PDF means whitelisting it alongside its source, mirroring the
  lecture-source convention.
- Caveat: MathJax loads from the cdnjs fallback; verify equations typeset in
  the output until MathJax is vendored into `sfig/external/`.

## Publication policy

GitHub Pages has **no unpublish mechanism**: anything committed to the
published branch is world-readable if the URL is known, whether or not it is
linked. Unlinked files (like `mock.js`) are unlisted, not private.

- Draft lectures and unreviewed material must stay off the published branch,
  not merely unlinked from the site.
- Per the course reconstruction plan: publish only reviewed, confirmed
  material; remove rather than inherit stale links and private URLs.

## Known follow-ups

- [ ] Vendor MathJax locally (`./download-packages` in `sfig/`) to remove the
      pinned cdnjs 2.4.0 fallback before the September link audit.
- [ ] Prune CS 221 demo helpers from `lectures/utils.js` (`backtrackingTree`,
      `australia`, module-link machinery) once CS120 lecture set stabilizes.
