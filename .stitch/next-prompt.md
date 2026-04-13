---
page: character_setup_onboarding
---
## Goal
Retrieve the design assets and HTML code for the MoveMyth **Character Setup Onboarding** screen and convert it to a React component tracking the project's design system.

## Screen Metadata
- **Project ID**: `12526426388134061364`
- **Screen ID**: `0fe01bd8ba9245d69b5b5529f9bb42b7`
- **Screen Name**: Character Setup Onboarding
- **Target Location**: `d:\UIT\GDGoC_UIT\GDGoC 25-26\Hackathon2026\MoveMyth\frontend\src\screens\CharacterSetupOnboarding.tsx`

## DESIGN SYSTEM (REQUIRED):
**DESIGN SYSTEM: MoveMyth "The Whimsical Narrative"**
- **Grid:** Floating containers, 0px border strokes (tonal separation only).
- **Radius:** All cards/inputs `rounded-xl` (24px+), buttons `rounded-full`.
- **Colors:** Background `#fffcf7`, Primary Purple `#7a4eb0`, Accent Gold `#f8a826`.
- **Effects:** Glassmorphism (80% opacity + blur) for floating elements. Soft tinted shadows using purple tones.
- **Typography:** Be Vietnam Pro. Oversized headlines, line-height 1.6.
- **Characters:** Lio the mascot should overlap or peek around cards to break asymmetry.

## Instructions
1. Use `mcp_StitchMCP_get_screen` to fetch details and the download URL.
2. Download the HTML using `curl` or `web_fetch`.
3. Convert the downloaded HTML into a clean React Functional Component using Tailwind classes (translating any specific generic style attributes into standard Tailwind or React `style={{}}` attributes).
4. Run `npx tsc --noEmit` in the `frontend/` directory to verify standard compilation.
5. Setup the `.stitch/next-prompt.md` for the next screen in the queue.
