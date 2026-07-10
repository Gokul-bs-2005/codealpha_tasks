# ✦ Lumen — Premium Animated Image Gallery

A luxury, glassmorphism-styled image gallery built with **pure HTML, CSS and Vanilla JavaScript** — no frameworks, no libraries, no build step. Created for the **CodeAlpha Frontend Development Internship**.

> Open `index.html` in a browser and everything just works.

---

## ✨ Features

### Core Gallery
- Responsive CSS Grid gallery with **18 high-quality Unsplash photographs**
- Staggered fade/scale entrance animation for every card
- Hover zoom on images with a gradient overlay revealing **title + category**
- Category filter bar — **All, Nature, Mountains, Beach, City, Wildlife, Architecture**
- Smooth, no-reload filtering with an animated glowing border on the active filter
- Live **search** by title or category, debounced for performance
- **Lazy loading** via `IntersectionObserver` + animated skeleton shimmer

### Lightbox
- Fullscreen viewer with background blur and zoom/fade transitions
- Previous / Next navigation, image counter, and category label
- **Keyboard support**: `Esc` closes, `←` / `→` navigate
- **Swipe support** for touch devices
- Per-image favorite toggle and **download** button
- Native **fullscreen mode**

### Bonus / Extra Features
- 🌗 Dark / Light mode toggle (persisted in `localStorage`)
- ❤️ Favorites system with a dedicated "favorites only" view
- 🔀 Shuffle gallery button
- 🧱 Masonry layout toggle
- ▶️ Auto-advancing slideshow mode
- ⬆️ Back-to-top button
- 🎯 Animated custom cursor (desktop)
- 🌌 Floating particle canvas background
- 🌈 Aurora / glowing blob background with mouse parallax
- 🌀 Ripple effect on every interactive button
- 🔎 Scroll-reveal animations via `IntersectionObserver`
- ⏳ Animated page loader with progress bar
- 📊 Animated hero statistic counters

---

## 🛠 Technologies Used

| Layer      | Tech                                   |
|------------|-----------------------------------------|
| Markup     | Semantic HTML5                          |
| Styling    | CSS3 (custom properties, Grid, glassmorphism, keyframe animation) |
| Behavior   | Vanilla JavaScript (ES6+, modular IIFE) |
| Typography | Google Fonts — **Outfit** & **Poppins** |
| Images     | Unsplash (royalty-free)                 |

No React, no Bootstrap, no jQuery, no build tools — just three files.

---

## 📸 Screenshots

> Add your own screenshots here after running the project locally, e.g.:
>
> `![Hero section](screenshots/hero.png)`
>
> `![Gallery grid](screenshots/gallery.png)`
>
> `![Lightbox view](screenshots/lightbox.png)`

---

## 🚀 Installation

No dependencies, no build step.

```bash
# 1. Clone or download this repository
git clone https://github.com/<your-username>/lumen-image-gallery.git

# 2. Move into the project folder
cd ImageGallery

# 3. Open index.html in your browser
#    (or serve it locally, e.g. with the VS Code "Live Server" extension)
```

That's it — the site runs entirely client-side.

---

## 📁 Folder Structure

```
ImageGallery/
│── index.html      # Semantic markup: nav, hero, filters, gallery, lightbox, footer
│── style.css        # Design tokens, glassmorphism theme, animations, responsive rules
│── script.js         # Modular vanilla JS: render, filters, search, lightbox, bonus features
│── images/            # (reserved for local image assets, if swapped from Unsplash URLs)
│── README.md           # Project documentation
```

---

## 🔭 Future Improvements

- Add pagination / infinite scroll for larger image sets
- Connect to a real image API (e.g. Unsplash API) for dynamic content
- Add drag-and-drop image reordering in masonry mode
- Add a service worker for offline support (PWA)
- Add unit tests for the filtering and search logic
- Add pinch-to-zoom inside the lightbox on mobile

---

## 👤 Author

**Built as part of the CodeAlpha Frontend Development Internship.**

Feel free to fork, extend, and use this project as a portfolio piece.

---

### License

Photographs are sourced from [Unsplash](https://unsplash.com) and are free to use under the Unsplash License. All code in this repository is free to use for learning and portfolio purposes.
