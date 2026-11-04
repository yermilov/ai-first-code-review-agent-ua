---
name: design-system
description: This deck's terminal-CRT design system — the four-size type scale (96 / 80 / 32 / 24), JetBrains Mono, `>` markers with phosphor glow, scan lines + noise, amber / green / cyan / blue on deep black, the bottom bar, and the deck's own primitives (SlideItem, LevelItem, Reveal, revealWindow, `.split`). Tokens in `src/design-system/`, per-slide layouts in `src/styles/slide-layouts.css`, enforced by `bun run lint:deck`. TRIGGER when creating or restyling a slide under `src/slides/`, editing CSS or tokens, picking colours or font sizes, when a raw hex or px font-size shows up in a diff, or when building chrome. Defers to the presentation-dev plugin skills (deck-design-system, slide-layouts, deck-engine, slide-content) for the general rules; this file is what is specific to THIS deck.
---

# Design system — ai-first-code-review-agent-ua

The general rules live in the **presentation-dev** plugin — load them, they are the source of
truth:

| Question | Skill |
|---|---|
| tokens, type scale, palette, light theme, lint | `presentation-dev:deck-design-system` |
| which layout, density caps, overflow | `presentation-dev:slide-layouts` |
| `SlideDefinition`, reveals, navigation, PDF export | `presentation-dev:deck-engine` |
| what goes on a slide, bullets, notes | `presentation-dev:slide-content` |

Below is only what is specific to this deck.

## The type scale — four sizes, enforced

`src/design-system/tokens.css` defines exactly four tiers; everything else aliases onto them.

| Tier | Token | At 1920×1080 | Use |
|---|---|---|---|
| Hero | `--font-size-hero` | 96px | title slide's `h1.hero` only |
| Heading | `--font-size-heading` | 80px | every slide title (`title:` on the SlideDefinition) |
| Body | `--font-size-body` | 32px | bullets, paragraphs, labels, `// SECTION` headers |
| Code | `--font-size-code` | 24px | code blocks and machine panels (system prompt, prompt panels, `[RULE.01]` tags) |

Each is `clamp(min, min(Xvw, Yvh), max)`: it scales with BOTH axes, so a short laptop window keeps
the stage's proportions. `--slide-text-compact` / `dense`, `--font-size-h1/h2/h3` and the section
header tokens are aliases — they shrink nothing. Inline `<code>` in prose is `0.88em`. Hierarchy
inside a tier is weight, colour and capitals, never a fifth size.

`bun run lint:deck` (`scripts/deck-lint.ts`, copied from the plugin) fails on a fifth size, a raw
px/rem font-size, a literal JSX `fontSize`, a raw hex/rgb outside `tokens.css`, or a `•`. It runs
in the pre-commit hook (`.githooks/pre-commit`, wired by `bun install` → `prepare`) and in
`bun run build`. A legitimate exception carries `deck-lint-allow <rule>: <reason>` on that line.

## Colour

Four accents — `--terminal-orange`, `--terminal-green`, `--terminal-cyan`, `--terminal-blue` —
plus neutrals. `--terminal-purple` / `--terminal-red` are for syntax highlighting only.
Tints are `color-mix(in srgb, var(--token) N%, transparent)`, never `rgba()`. Drop shadows mix
from `--terminal-shadow` (black on the CRT, warm umber on paper). Colours that belong to a
*picture of something else* are tokens with a comment saying so: the macOS traffic lights
(`--chrome-dot-*`). Picture colours elsewhere — the DOU palette on the AI-innovator curve, the
status-page colours on industry-patterns, the mock GitHub and raw-HTML pages — stay literal with
a `deck-lint-allow colour` reason. Code-block syntax colours are `--syntax-*` tokens
(GitHub-dark / GitHub-light). Any new `:root` colour needs its `[data-theme="light"]` mirror
unless it is such a fixed picture colour.

## Primitives (`src/components/SlideElements.tsx`)

| Primitive | Use |
|---|---|
| `SlideItem` | the `>` bullet. `hidden` keeps its slot while not yet revealed |
| `LevelItem` | weighted bullet `>>` / `>` / `--` (available; not yet used by this deck); optional `aside` |
| `Reveal` | any non-bullet block (chip, QR, panel) revealed in place |
| `revealWindow(items, shown, size)` | slots for one-bullet-per-stage lists; a sliding window once `size` is reached |
| `Code`, `Quote`, `Emphasis`, `SlideLink`, `SectionHeader` | inline pieces — don't re-declare local `Command` / `Prompt` helpers |

**A reveal never moves what is already on screen**: every revealable element is laid out from
stage 0 and hidden with `.is-unrevealed` (visibility: hidden, no animation). The only exemption
is a sliding window, whose survivors move up a slot by design.

## Layout

- A titled slide renders `h2.slide-title` as an in-flow band and its content inside
  `.slide-body`, which gets exactly the height the title leaves. Size media with
  `max-height: 100%` / `height: 100%` against it — **never** `calc(var(--vh-full) - <chrome px>)`.
- `.split` (in `patterns.css`) is the shared two-column text + visual layout; three visible
  bullets beside the visual. Visuals step aside below 900px wide or 500px tall.
- One-slide layouts go in `src/styles/slide-layouts.css`, scoped to that slide's class (blocks
  moved out of former `<style>` tags are headed `moved from <File>.tsx`). No `<style>` tags in
  slides; inline `style={{}}` only for a per-item dynamic value.
- SVG charts (conclusions, AI-innovator curve) draw labels
  at the picture's own scale; each such `fontSize` carries a `deck-lint-allow` comment.
- Keyframes that move something centred use the `translate` / `scale` properties, not
  `transform`, so they don't clobber the centring.

## Validation

1. `bun run check` — deck-lint + async-slide gate + typecheck
2. `bun run dev`, hard-refresh `http://localhost:5173/ai-first-code-review-agent-ua/`
3. Step through every reveal of each changed slide **in both languages** (`ukrainian` /
   `english`, or `?lang=en`); screenshot the last reveal
4. Overflow and computed sizes across 1920×1080, 1728×850, 1280×720, 1024×768 and landscape
   phones — measured (deck-engine, *Verifying a change*), not eyeballed
