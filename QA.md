# Verification — site-wide 3D update

## Passed for this update

- Clean dependency installation using the existing lockfile; no new application dependency added.
- Production Vite build, prerendered HTML and both existing content tests.
- Production build loaded and hydrated in headless Chromium without uncaught page errors.
- Desktop at 1440 × 1000: readable layout and no horizontal document overflow.
- Actual pointer movement applies project-card tilt and the hover state.
- Site-wide motion toggle immediately clears tilt; its off preference survives reload.
- Skills and contact anchor navigation works.
- Mobile layouts at 390 × 844 and 320 × 740 have no horizontal document overflow.
- Mobile menu opens and closes after selecting a navigation link.
- Runtime reduced-motion preference changes disable effects and reveal all content.
- Fresh reduced-motion load uses no canvas and no card transform.
- Prerendered headings and all three projects remain available with JavaScript disabled.
- Screenshots inspected for the desktop hero/project cards and mobile skills/contact layouts.

## Limits

The checks used headless Chromium and emulated mobile viewports. They do not establish Safari, Firefox, real-device touch, GPU performance or screen-reader certification. The existing hero renderer still needs a check on a hardware-accelerated device; the new site-wide geometry is CSS-based and does not depend on WebGL. No Lighthouse or frame-rate score is claimed.

Project, certificate and contact destinations were retained. The existing tests check URL syntax and internal anchors, not the continuing availability of external pages. No website was published and no external account was changed.

## Real-device acceptance

1. Run `npm ci`, then `npm run dev`, and open the printed URL.
2. Move the pointer over projects, skills, timeline, certificates, buttons and the contact panel. Confirm tilt resets when leaving each surface.
3. Scroll from hero to footer. Check background rotation, reveals and normal scrolling.
4. Toggle **3D motion off**; verify the page becomes still. Reload and verify the preference persists.
5. On a phone, use the menu, scroll through each section and follow a project link. Hover tilt is intentionally disabled for touch pointers.
6. Enable reduced motion in your operating system. Confirm **Motion reduced** appears and the portfolio remains readable.
7. With WebGL2 available, check the original hero planet, drag, rotate/color controls, pause/resume and resume download.

## Book and lipstick hover update

Verified in headless Chromium: lipstick cap opens on actual pointer hover and closes on pointer leave; book cover and three leaves flip and reset; keyboard focus triggers the book; the global motion switch and reduced-motion preference keep the objects closed and still. The mobile layout fits a 320px viewport. No uncaught page errors occurred. Updated production build and existing content tests passed.
