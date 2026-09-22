# Shameen — 3D portfolio

A resume-based portfolio built with React, Vite, Three.js and React Three Fiber. The entire page uses interactive depth: a procedural planet in the hero, pointer-tilting cards, a scroll-reactive geometric background, layered headings and dimensional project illustrations. The content stays usable without WebGL or JavaScript.

## Run locally

Install Node.js 24 LTS (the project accepts Node >=22.12). Extract the ZIP, open the `shameen-portfolio` folder in VS Code, then open **Terminal → New Terminal**:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

You must use the development server. Double-clicking `index.html` will not run an ES-module application.

To test the production build:

```sh
npm run build
npm run check
npm run preview
```

Open the preview URL printed in the terminal, normally `http://localhost:4173`. Press Ctrl+C to stop a server. `dist/` is already included as a build snapshot; rebuild it after changes.

## New: interactive 3D throughout the website

- **Hero:** the existing draggable Three.js planet, with subtle pointer depth on the headline.
- **Projects:** perspective tilt, cursor-following light, raised typography and a lipstick, voice waveform or miniature book illustration. These are decorative concept illustrations, not actual product screenshots or the published book cover.
- **Project hover actions:** GlowSync’s lipstick cap lifts off and the lipstick rises on hover; leaving the card closes it. Untitled’s cover flips open and three pages turn in sequence; leaving closes the book. Keyboard focus on either project link triggers the same effect. Motion-off and reduced-motion modes keep both still.
- **About, skills and journey:** layered panels, tilting skill cards and raised timeline/certificate surfaces.
- **Contact and navigation:** a dimensional contact panel, rotating decorative star, responsive buttons and brand mark.
- **Across the page:** a CSS 3D cube and orbital sculpture follow scroll and pointer position, with a perspective grid, subtle particles and scroll entrance transitions. The background cannot intercept clicks or scrolling.
- **Motion control:** use the bottom-right **3D motion on/off** button. Your choice is remembered in this browser. It stops ambient animation, pointer/scroll effects and automatic hero motion. Explicit hero rotate/color/drag controls remain available.
- **Mobile:** scrolling drives the background; hover tilt is disabled on coarse pointers so touch scrolling remains natural. There is no device-orientation permission request.
- **Accessibility:** reduced-motion or data-saving preferences disable the automatic effects; no new animation dependency or WebGL canvas is needed outside the hero. The site remains readable when motion is disabled or JavaScript is unavailable.

Edit `src/immersive.css` for appearance and `src/ImmersiveEffects.jsx` for interaction. The `data-depth` number on each surface controls its maximum pointer rotation in degrees. All decorative geometry is generated in code, so there are no additional image downloads.

## Change content

Edit **`src/data.js`**. It holds the name, headline, introduction, biography, project entries, skill groups, certificates, journey, links and palette. Fixed interface labels and section headings are in `src/App.jsx`.

- `email`: intentionally blank because the supplied resume has no email. Add your real email to show an email button. Contact already works through LinkedIn. There is no pretend form or unsent-message success state.
- `siteUrl`: intentionally blank until you know your production origin. Set it to your exact HTTPS domain (without a path) and rebuild. This enables canonical URL, Open Graph URL and `sitemap.xml` generation.
- `projects[].tech`: empty until you add confirmed project stacks. The existing chips describe project topics, not unverified technologies.
- `public/resume.pdf`: supplied resume, included as the download. Replace it with your updated resume using the same name.
- `theme.accent` and `theme.warm`: interface colors. Scene colors are defined in `src/OrbitalScene.jsx`.

### Content assumptions

The uploaded `Resume 2.pdf`, including its embedded links, is the source of facts. The selected work section includes **two software projects and one published book**. There are no invented employers, testimonials, project performance metrics or project stacks. GlowSync is described as an exploration/concept as in the resume. Experience is presented as education, authorship and participation, not employment.

The dark orbital theme, editorial headline and short creative copy are design assumptions. The site does not add TEDx details or other facts absent from this resume. Project links open the repositories supplied in the resume; they are not claimed to be live demos. Project covers are typographic treatments, not screenshots of the applications or the actual book cover.

## Deploy to Vercel

1. Put the extracted project files in a GitHub repository. The repository root should contain `package.json`, `src/` and `vercel.json`.
2. In Vercel, choose **Add New → Project**, import that repository and select the correct root directory.
3. The included configuration selects **Vite**, build command **`npm run build`**, and output directory **`dist`**. Choose Node.js 24 in project settings if prompted.
4. Deploy. No environment variables, database, account tokens or email API keys are needed.
5. Copy your final production domain to `portfolio.siteUrl` in `src/data.js`, commit and redeploy.
6. Confirm `/resume.pdf`, `/robots.txt` and `/sitemap.xml` work on the deployed domain. The sitemap is generated only after `siteUrl` is filled in.

This package is ready to deploy; it has not been published to your Vercel account.

Official references: [Vite getting started](https://vite.dev/guide/) and [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## 3D controls and fallback

- Drag the scene horizontally to orbit. Vertical touch gestures remain available for page scrolling.
- Hover over the planet to brighten its rim.
- Use the **left/right buttons** with keyboard Enter or Space for the equivalent orbit action.
- Use **Pause/Resume** to stop/start automatic motion. Use **Change scene color** to cycle the palette and caption.
- Scrolling through the hero gently changes its inclination; scrolling is never hijacked.
- The animation loop stops when the hero is outside the viewport or the browser tab is hidden.
- Reduced-motion and data-saving preferences start with a still layout and no Three.js download. **Explore 3D** explicitly opts in to a manually controlled scene; continuous animation remains off for these preferences.
- WebGL2 support is probed before importing the heavy scene. Missing/poor WebGL support, context loss, import failure, or a setup timeout returns to the still layout.
- No core information is inside the canvas. All content, navigation, resume download and contact links are normal HTML.

## Performance choices

- Three.js and React Three Fiber are in a separate, dynamically imported chunk.
- The initial page is pre-rendered to real HTML at build time, then hydrated by React.
- The scene starts after browser idle time and only when the hero is visible.
- Pixel ratio capped at 1.5 desktop / 1.25 mobile; mobile uses fewer particles and sphere segments.
- Efficient custom shaders and basic materials, no texture downloads, postprocessing, shadows or large 3D model assets.
- Small locally hosted WOFF2 fonts, `font-display: swap`, stable scene dimensions and responsive CSS.
- Vercel caching for fingerprinted assets. No trackers or third-party runtime requests.

The measured build separates approximately **69 KB gzip** of application JavaScript from approximately **234 KB gzip** of optional 3D JavaScript. These are bundle sizes, not Lighthouse scores. No Lighthouse score is claimed. The large-chunk warning is expected for the isolated 3D bundle; it is not included in the initial module preload.

## Accessibility and SEO

Semantic regions, heading hierarchy, visible focus rings, a skip link, native anchor navigation, keyboard-operable buttons, menu Escape handling and reduced-motion support are included. Decorative canvas content is hidden from assistive technologies. External links include an accessible new-tab notice.

Build-time metadata includes title, description, Open Graph and X text, and Person structured data. With `siteUrl` configured, it also generates canonical URL and sitemap. Search indexing is not guaranteed. A social-sharing image is intentionally not included.

## Source map

| File | Purpose |
| --- | --- |
| `src/data.js` | Editable portfolio facts, links, content and palette |
| `src/App.jsx` | Semantic sections, navigation, accessibility and scene fallback |
| `src/OrbitalScene.jsx` | Procedural Three.js scene, shaders and interaction |
| `src/ImmersiveEffects.jsx` | Site-wide motion preferences, pointer/scroll effects and CSS 3D sculptures |
| `src/immersive.css` | Layered cards, ambient geometry, responsive depth and motion fallbacks |
| `src/styles.css` | Responsive styles, local fonts, reduced motion and print |
| `src/main.jsx` | Browser entry and hydration |
| `src/render.jsx` | Build-time React rendering entry |
| `scripts/prerender.mjs` | Static HTML, SEO metadata, robots and sitemap generation |
| `scripts/content.test.mjs` | Build content, links and internal anchor checks |
| `public/` | Resume, favicon and font files with licenses |
| `vercel.json` | Deployment, caching and response headers |
| `package-lock.json` | Reproducible dependency versions |
| `QA.md` | Checks performed and remaining verification limits |

## Troubleshooting

- **Port in use:** Vite prints the next available port; use that printed URL.
- **Node engine warning:** use Node 24, then run `npm ci` again.
- **Still view:** WebGL2 may be disabled or your browser may reject the available renderer. The portfolio remains functional. Check in an up-to-date hardware-accelerated browser if you want the 3D scene.
- **Reduced motion:** continuous animation is intentionally off. It should not be enabled merely to make the site work.
- **Changes missing on Vercel:** rebuild and redeploy; the `dist/` snapshot does not change until `npm run build` runs.

Fonts are licensed under SIL Open Font License; their license files are included in `public/fonts/`. The source contains no API secrets. Keep dependencies and your professional information up to date.
