# David Chen — Portfolio

Personal portfolio site for David Chen, Technical Program Manager at DoorDash. Built as a static site with award-winning animation effects.

**Live:** [davidychen.com](https://davidychen.com)

## Sections

- **Hero** — Video background with animated preloader entrance and split text reveal
- **About** — Professional background and approach
- **Experience** — Career timeline at DoorDash (TPM + PM)
- **Impact Highlights** — Key metrics ($1B+, $100M+, $20M+)
- **Education** — MSc Computer Science, MSc Finance, BSc Public Finance
- **Skills** — Core competencies with animated progress bars and skill tags
- **Publications** — DoorDash Engineering Blog and academic publications
- **Testimonials** — Colleague endorsements carousel
- **Creative Work** — Filterable portfolio gallery (Projects, Photography, Art)
- **Contact** — Partnership areas and social links

## Animation Effects

The site uses a GSAP-centric animation system with 7 effects:

| Effect | Description |
|--------|-------------|
| Preloader | Counter 0→100% with choreographed hero entrance sequence |
| Split Text | Hero name reveals word-by-word from masked overflow |
| Smooth Scroll | Lenis-powered inertia scrolling (desktop) |
| Custom Cursor | Context-aware dot + ring (purple on light, white on dark) |
| Magnetic Buttons | Nav links and CTAs follow cursor with elastic spring return |
| Staggered Grid | Portfolio and impact cards cascade in on scroll |
| Parallax Tilt | Subtle 3D tilt with glare on hover (vanilla-tilt.js) |

All animations are disabled on touch devices for native mobile performance.

## Tech Stack

| Category | Libraries |
|----------|-----------|
| Animation | [GSAP](https://gsap.com/) (core + ScrollTrigger + SplitText) |
| Smooth Scroll | [Lenis](https://lenis.darkroom.engineering/) |
| Hover Effects | [vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/) |
| Layout | [Bootstrap 4](https://getbootstrap.com/) |
| Icons | [Font Awesome](https://fontawesome.com/) |
| Gallery | [Isotope](https://isotope.metafizzy.co/) + [SimpleLightbox](http://simplelightbox.com/) |
| Utilities | [jQuery](https://jquery.com/) |

## Setup

```sh
git clone https://github.com/davidychen/davidychen.github.io.git
cd davidychen.github.io
# Open directly (static site, no build step required)
open index.html
# Or serve locally
python3 -m http.server 8080
```

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
