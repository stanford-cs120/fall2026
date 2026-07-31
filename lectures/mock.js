// CS120 mock lecture: verifies sfig setup (math, pauses, prose notes).
G = sfig.serverSide ? global : this;
G.prez = presentation();

add(titleSlide('Mock Lecture: Setup Verification',
  nil(),
  parentCenter('CS120: Introduction to AI Safety — Autumn 2026'),
));
prose(
  'These are speaker notes attached via prose().',
  'In print mode they appear on facing pages; in full screen they are hidden.',
);

add(slide('Checklist',
  bulletedText('sfig core loads from ../sfig/internal/'),
  bulletedText('utils.js helpers: add(), prose(), titleSlide(), outlineSlide()'),
  pause(),
  bulletedText('pause() creates build levels'),
  bulletedText('Math renders via MathJax (CDN fallback)'),
_));
prose(
  'If you can see this slide with working bullets and the second pair appears on a click,',
  'builds are working.',
);

add(slide('Math rendering',
  'The total variation distance between $P$ and $Q$:',
  parentCenter('$d_{\\text{TVD}}(P, Q) = \\frac{1}{2} \\sum_x |P(x) - Q(x)|$'),
  pause(),
  'Inline check: a hazard with probability $p$ and severity $s$ contributes risk $r = p \\cdot s$.',
_));
prose(
  'Both display and inline math should typeset.',
  'If math shows raw dollar signs, MathJax failed to load — check the CDN fallback in sfig.js.',
);

add(outlineSlide('Course roadmap (placeholder)', 0, [
  ['framing', 'Framing AI safety'],
  ['inputs', 'Human inputs and data'],
  ['deployment', 'Unintended effects and deployment'],
  ['evaluation', 'Evaluation, red teaming, and auditability'],
  ['governance', 'Governance, integration, and projects'],
]));
prose('The five modules from the reconstruction plan, as an outline slide.');

add(slide('Conclusion',
  'If all four slides rendered, the fall2026 sfig setup works.',
  parentCenter(frameBox('Setup verified').bg.fillColor('lightgreen').end),
_));
prose('End of mock presentation.');
