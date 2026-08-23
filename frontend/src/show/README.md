# Babel — The River Remembers

Standalone React/TSX cinematic scrollytelling component.

## Integration

Copy `BabelExperience.tsx` and `BabelExperience.css` into a React + TypeScript application and render:

```tsx
import BabelExperience from "./BabelExperience";

export default function LoreRoute() {
  return <BabelExperience />;
}
```

No external runtime dependency is required beyond React. The component deliberately does **not** use the supplied book illustrations. The visual language is authored from CSS/SVG/DOM primitives so the component is self-contained and does not depend on asset paths.

## Design notes

- Long-form scroll is the narrative timeline.
- The Siirh is an SVG path that draws/reappears rather than a decorative background.
- Sabaah is represented as a controlled 2.5D CSS composition rather than fake 3D texturing.
- The gods sequence uses an abstract CSS figure/veil rather than manipulating the book illustration.
- Siides are individual botanical DOM glyphs, not generic particles.
- The Black Tower is a deliberately sparse CSS construction.
- Reduced-motion support preserves the sequence while removing most motion.
- Lore strings are separated at the top of the module so they can be replaced with CMS/data without changing rendering logic.

## Source fidelity

The lore copy was selected from the uploaded GODS Babel material, including the Siirh's role in water and commerce, Sabaah's three levels, the caste descriptions, the disappearance of the old gods, the Siides, the dark tower, Taerhonis, and Khep/Uruk.
