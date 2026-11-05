# FieldFix

**An offline field-service repair assistant — in your pocket.**

Guided fault diagnosis, step-by-step repair guides, a service log and field calculators — all running 100% offline, with no signal required. Nothing is uploaded; everything lives on your device.

## Pages
- **Home** (`index.html`) — landing with a live 3D mechanical-gears hero.
- **Diagnose** (`diagnose.html`) — pick equipment + symptom → ranked likely causes with likelihood %, severity, what to check and how to fix (generators, pumps, electric motors, HVAC).
- **Guides** (`guides.html`) — step-by-step repair procedures with tool lists and safety call-outs.
- **Log** (`log.html`) — service log per asset (done / monitor / urgent) with history.
- **Tools** (`tools.html`) — Ohm's law (V·I·R·P), torque converter (N·m ↔ ft·lb), wire ampacity lookup.
- **Settings** (`settings.html`) — theme, accent, data export.

## Highlights (50+ features)
Guided diagnosis across 4 equipment classes and multiple symptoms each · ranked causes with likelihood & severity · check/fix guidance · step-by-step repair guides with tools & safety · service log (add/edit/delete, status, history) · Ohm's law calculator · torque unit converter · wire ampacity lookup · JSON export · 3D mechanical-gears hero (Three.js) · custom cursor · ambient motion · scroll reveals · shortcuts · autosave · fully offline · responsive.

> Repair guidance is general reference — always follow the equipment manufacturer's manual and local safety codes.

## Deploy (free)
Static site, no build. Upload the folder to GitHub → Netlify/Vercel. Local: `python3 -m http.server`.

## Tech
Vanilla HTML/CSS/JS + Three.js (bundled locally, works offline). Fonts: Archivo, Inter, IBM Plex Mono.
