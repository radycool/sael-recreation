# Oryzo Recreation

Step-by-step recreation of oryzo.ai's scroll-synced 3D product page, built with React + React Three Fiber + GSAP.

## Step 1 — Scaffold (you are here)

### Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`). You should see "Step 1: Scaffold ✅".

### Push to GitHub

```bash
git init
git add .
git commit -m "Step 1: project scaffold"
```

Then create a new empty repo on GitHub (no README/license — you already have one), and:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## What's next

- **Step 2:** Design tokens (done — see `src/styles/tokens.css`) + fine-tuning
- **Step 3:** Fixed canvas layer + loading your OBJ model
- **Step 4:** Smooth scroll (Lenis) + GSAP ScrollTrigger sync engine
- **Step 5:** Section-by-section keyframes
- **Step 6:** Content + copy
- **Step 7:** Polish (lighting, post-processing, loading screen)
- **Step 8:** Deploy

## Project structure

```
src/
  components/   shared UI pieces (nav, buttons, cursor, etc.)
  scenes/        Three.js / R3F scene + model logic
  sections/      one file per page section (hero, features, etc.)
  styles/        tokens.css (design vars) + global.css
  hooks/         scroll-sync hooks, custom logic
  assets/models/ your .obj / .glb files go here
```
