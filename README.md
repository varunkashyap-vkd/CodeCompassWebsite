# Code Compass — Static site

This is a simple, static website for the Code Compass personal brand.

Files added:
- `index.html` — landing page with hero, connect section, and FAQ
- `most-frequent.html` — curated list of common interview problems
- `styles.css` — site styles and animations
- `script.js` — small JS for reveal animations and accordion behavior
- `assets/` — (existing) logo, profile photo, topmate screenshot

To preview locally, open `index.html` in your browser. For a better dev experience, serve the folder (example using Python):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Next suggestions:
- Add direct YouTube video links to `most-frequent.html` or move links into a JSON file and render dynamically.
- Add responsive nav / mobile menu.
- Hook up analytics or embed playlists.
