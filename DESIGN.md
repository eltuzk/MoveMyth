# Design System: MoveMyth Design System
**Project ID:** 12526426388134061364

## 1. Visual Theme & Atmosphere
**Creative North Star: "The Living Storybook"**

MoveMyth moves beyond static app interfaces to create a tactile, immersive digital environment. We reject the "flatness" of modern SaaS; instead, we embrace **Organic Depth**. By utilizing layered watercolor textures, glowing depth markers, and intentional asymmetry, we create a space that feels like a physical pop-up book brought to life by AI.

The layout avoids rigid, clinical grids. Instead, we use "floating" containers and overlapping elements (like Lio the mascot peeking over a card) to break the box and encourage a sense of wonder and exploration for children aged 4-10.

**Core Atmosphere Adjectives:**
- **Whimsical:** Playful and full of wonder.
- **Immersive:** Feels like a physical world rather than a digital tool.
- **Organic:** Avoids sharp lines and clinical perfection; prefers soft, bouncy shapes.
- **Magical:** Uses glows, tinted shadows, and glassmorphism to imply magic.

## 2. Color Palette & Roles
Our palette is rooted in a "Twilight Adventure" theme—warm, safe creams contrasted with deep, magical purples.

### Primary Colors
- **Magic Purple (#7a4eb0):** The primary color for core actions and "Magic" identity.
  - *On Primary (#ffffff):* Essential for contrast on purple backgrounds.
- **Deep Twilight (#6B3FA0):** Signature brand color for titles and bounce effects.
- **Enchanted Lavender (#c596fe):** Used for containers and active state glows.

### Secondary & Tertiary
- **Spirit Teal (#007168):** Represents secondary actions and "Spirit" themes.
- **Adventure Gold/Amber (#f8a826):** Tertiary color used for "Play," "Collect," and special high-attention feedback.

### Surface & Neutral
- **Base Paper (#fffcf7):** The "surface" color; the foundational paper of our storybook.
- **Twilight Tinted Night (#0e0e0c):** Used for inverse surfaces and dark modes (never use pure black #000000).
- **Muted Stone (#383835):** Used for primary text on light backgrounds.
- **Soft Slate (#656461):** Used for secondary text/variant content.

## 3. Typography Rules
We use **Be Vietnam Pro** across all scales to ensure perfect legibility and full support for Vietnamese diacritics.

- **Display & Headlines (The Narrator):** Large, welcoming, and slightly "bouncy." Uses scales from `display-lg` to `headline-sm` with `font-extrabold`.
- **Titles & Body (The Dialogue):** Priority on generous line heights (1.5x+) to assist young readers. `title-md` and `body-lg` are standard for readability.
- **Labels (The Guide):** Sparingly used for metadata, often in all-caps with `tracking-widest`.

**Font Family:** `Be Vietnam Pro` (Weights: 100 to 900 supported).

## 4. Component Stylings

### Buttons (The "Pill" Standard)
- **Primary (The Adventure Button):** Full rounded pill shape (`rounded-full`), Purple background.
- **Secondary (The Spirit Button):** Teal background, used for alternative paths.
- **Action Buttons:** Often use `tertiary-container` (Amber) with circular or pill shapes for "Play" and "Collect."
- **Interaction:** On hover/active, buttons should scale slightly (1.05x to 1.1x) to feel responsive and "squishy."

### Cards & Containers
- **Corner Roundness:** Generously rounded corners using `rounded-xl` (approximately 24px-28px radius).
- **Surface Nesting:** Separation is achieved through tonal shifts (e.g., `surface-container-low` on `surface`) rather than borders. **Borders are strictly prohibited.**
- **Interaction:** `card-hover` class adds a diffused shadow and a subtle Y-translation.

### The "Glass" Layer
- **Floating Bubbles:** Used for speech or PiP (Picture-in-Picture) windows.
- **Style:** 80% opacity background + 16px Backdrop Blur (`glass-bubble`).

## 5. Layout Principles
- **The "No-Line" Rule:** Do not use strokes/borders for sectioning. Use background color differences.
- **Asymmetry:** Overlapping elements (like Lio peeking over cards) break the rigid grid and add life.
- **Tinted Depth:** Shadows are not grey, they are **Tinted**. For example, a soft purple shadow (`#49197d` at 8% opacity) creates a magical twilight glow.
- **Whitespace:** Prioritize vertical white space (16px+) to keep content readable and uncluttered for children.

## 6. Design System Notes for Stitch Generation
*When prompting Stitch for new MoveMyth screens, include this block:*

> **DESIGN SYSTEM: MoveMyth "The Whimsical Narrative"**
> - **Grid:** Floating containers, 0px border strokes (tonal separation only).
> - **Radius:** All cards/inputs `rounded-xl` (24px+), buttons `rounded-full`.
> - **Colors:** Background `#fffcf7`, Primary Purple `#7a4eb0`, Accent Gold `#f8a826`. 
> - **Effects:** Glassmorphism (80% opacity + blur) for floating elements. Soft tinted shadows using purple tones.
> - **Typography:** Be Vietnam Pro. Oversized headlines, line-height 1.6.
> - **Characters:** Lio the mascot should overlap or peek around cards to break asymmetry.
