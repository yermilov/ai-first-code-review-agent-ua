# CLAUDE.md

## Project Overview

**AI-first розробка на практиці: кейс створення code review агента** — Yarik's talk at the
AI-First Meetup (May 2026), a terminal-themed React site with Claude Code-style command
navigation. Hosted on GitHub Pages at https://yermilov.github.io/ai-first-code-review-agent-ua

## Skills — read these before touching the deck

The deck follows the **presentation-dev** plugin (enabled in `.claude/settings.json`). Load the
one that matches the task:

| Task | Skill |
|---|---|
| repo, stack, assets, deploy, publishing | `presentation-dev:presentation-stack` |
| tokens, type scale, colour, lint, light theme | `presentation-dev:deck-design-system` |
| choosing a layout, density caps, overflow | `presentation-dev:slide-layouts` |
| `SlideDefinition`, reveals, navigation, timer, PDF export | `presentation-dev:deck-engine` |
| what goes on a slide, bullets, notes, factual claims | `presentation-dev:slide-content` |
| images, video, diagrams | `presentation-dev:deck-visuals` |
| UA ↔ EN parity | `presentation-dev:deck-translation` |

Project-local skills: `design-system` (this deck's tokens and primitives — read it when styling)
and `generate-image` (slide images + saved prompts).

## Tech Stack

Bun · Vite 5 · React 18 · TypeScript strict · react-syntax-highlighter · qrcode.react ·
roughjs · vite-plugin-imagemin · Playwright (dev, PDF export) · GitHub Pages via Actions.

## Commands

```bash
bun install      # REQUIRED before the first `bun run dev`; also wires the pre-commit hook
bun run dev      # http://localhost:5173/ai-first-code-review-agent-ua/
bun run check    # deck-lint + async-slide gate + typecheck (what the pre-commit hook runs)
bun run lint:deck
bun run build    # lint:deck → check:async-slides → tsc → vite build
bun run preview
bun run pdf      # 1920×1080 PDF of every slide at max reveal → dist/ai-first-code-review-agent-ua.pdf
```

## Project Structure

```
src/
├── App.tsx                  # <Presentation slides={slides} />
├── slides/
│   ├── index.ts             # THE RUNNING ORDER — the `slides` array
│   ├── exportContract.ts    # async-slide classification for the PDF exporter
│   └── *Slide.tsx           # one SlideDefinition per file (36 in the talk)
├── components/
│   ├── Presentation.tsx     # timer, theme, language, progress, export API
│   ├── Slide.tsx            # .slide wrapper; titled slides get .slide-title + .slide-body
│   ├── SlideElements.tsx    # SlideItem, LevelItem, Reveal, revealWindow, Code, Quote, Emphasis, SlideLink, SectionHeader
│   ├── AgendaPreviews.tsx   # live mini-slides on the agenda cards
│   ├── diagram/             # SVG diagram kit (DiagramCanvas, StageNode, FlowArrow, …)
│   ├── TerminalInput.tsx · Timer.tsx · SlideProgress.tsx · CodeBlock.tsx · exportRegistry.ts
│   └── pacman/              # the Pac-Man easter egg engine
├── data/sections.tsx        # the three talk sections (engineer / team / org) shared by agenda + section slides
├── hooks/useSlideNavigation.ts   # step-path navigation (utils/traversal.ts)
├── utils/traversal.ts       # deckPath(): the talk as one line of (slide, reveal) steps
├── utils/preloadAssets.ts   # warms every src/assets/** image, audio, mp4
├── design-system/           # tokens.css · base.css · patterns.css · components.css
├── styles/slide-layouts.css # one block per slide
├── assets/                  # auto-preloaded media (put later-slide media here)
└── prompts/*.json           # prompts of generated images
scripts/deck-lint.ts         # the design-system linter (from the deck-design-system skill)
.githooks/pre-commit         # runs `bun run check`
```

## Adding a slide

1. Create `src/slides/MySlide.tsx` exporting a `SlideDefinition`.
2. Import it in `src/slides/index.ts` and place it in the `slides` array (that array is the talk).

```tsx
import { SlideDefinition } from '../types/slides';
import { revealWindow, SlideItem } from '../components/SlideElements';

const BULLETS = [<>перший пункт</>, <>другий пункт</>, <>третій пункт</>];

export const MySlide: SlideDefinition = {
  id: 'my-slide',
  title: (
    <>
      <span className="text-dim">&gt;</span> <span className="text-green">my</span>{' '}
      <span className="text-orange">slide</span>
    </>
  ),
  maxRevealStages: BULLETS.length,
  content: ({ revealStage }) => (
    <div className="my-slide">
      {revealWindow(BULLETS, revealStage).map(({ item, index, hidden }) => (
        <SlideItem key={index} delay={0} hidden={hidden}>{item}</SlideItem>
      ))}
    </div>
  ),
  notes: 'what you must not forget to say',
};
```

Rules that matter (details in the skills):

- **Four font sizes**: 96 hero / 80 heading / 32 body / 24 code — tokens only. `bun run lint:deck`
  fails on anything else. Never shrink type to fit: split the slide or use a sliding window
  (`revealWindow(items, shown, size)`). deck-lint does not see CSS inside a slide's `<style>`
  template string — check those slides by computed size.
- **A reveal never moves what is on screen**: lay everything out from stage 0, hide what is not
  yet revealed (`hidden` / `<Reveal show>`), don't unmount it.
- **Titled slides**: content lives in `.slide-body`, which has an explicit height. Size media with
  `max-height: 100%` — never `calc(var(--vh-full) - <px>)` in new code.
- **Colours are tokens**; tints are `color-mix()` over a token. No raw hex outside `tokens.css`
  (SVG/JS picture constants excepted).
- **Per-slide CSS** goes in `src/styles/slide-layouts.css`; don't add new `<style>` tags. Shared
  patterns (`.split`, `LevelItem`, …) live in `src/design-system/`.
- **Async slides** (fetch etc.) set `asyncSettle: true`, call `exportRegistry.markSlideSettled`,
  and are listed in `src/slides/exportContract.ts` — the build fails otherwise.

## Assets

- Import every asset; never hardcode a path. `public/` files: `import img from '/x.png?url'`;
  `src/assets/` files: relative import. A literal `src="/x.png"` 404s on Pages (base path).
- Media a later slide needs goes in `src/assets/` — it is preloaded while the title is up
  (images, audio and `*.mp4`).
- Animated content is **MP4, not GIF**:
  ```bash
  ffmpeg -i in.gif -vf "fps=15,scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p -crf 28 out.mp4
  ```
  `<video autoPlay loop muted playsInline src={v} />`
- PNG/JPEG compression happens at build time (`vite-plugin-imagemin`); `loading="lazy"` on
  images after the first slide.
- Full-bleed art: set `SlideDefinition.background` (applied to `.slide` itself) with a gradient
  layered over the image, instead of an inner rounded frame that clips content.

## Navigation

Type in the input box (letters only act on an EMPTY box; anything else just clears it):

- `next` / `n` → next slide · `prev` / `back` / `p` / `b` → previous slide
- `reveal` / `r` / `move` / `m` → next reveal step
- `<N>` → step N (the same N as `#slide-N` in the URL) · `-<N>` → N steps from the end
- `first` / `start` / `home`, `last` / `end`
- `light` / `dark` → theme (persisted)
- `english` / `ukrainian` → slide language (persisted, mirrored in `?lang=en|uk`)

Keys (outside the box): → ↓ Space PageDown Enter advance, ← ↑ PageUp Backspace go back,
Home/End. PageDown/PageUp always work (clicker). Swipes on touch.

**`#slide-N` is a STEP of the talk, not a slide index** — every reveal is a step, detours are
inlined (`utils/traversal.ts`). Adding a slide or a reveal shifts every later step id; say so when
reporting a structural change.

The timer starts when you leave the title slide, resets when you return to it, survives a reload,
and discards a start older than 4 hours. The talk length is `TALK_SECONDS` in `Timer.tsx` (60
min). The progress bar ("context left until auto-compact") weights every reveal equally and
appears past the half-way point.

## Two languages (UA ↔ EN)

The deck is bilingual at runtime (mechanism from `dou-days-2026` via `pragmatic-vibe-clauding-en`):
**Ukrainian is the home language** — the talk was given in Ukrainian — English the alternate.
`src/context/LanguageContext.tsx` gives `tr(lang, uk, en)` and `<T uk="…" en="…" />`;
render-function slides read `lang` from their props; `background` may be a function of `lang`.

- Bullet arrays come in pairs, `X_UK` / `X_EN`, **same length, same order** — reveal counts are
  derived from one of them. A new or edited bullet must be changed in both.
- The Ukrainian copy is the proofread original. English strings marked `// EN: own translation`
  were written for this switch (rewritten, not translated literally) and are worth a read by Yarik.
- Stays as-is in both: what is typed to or shown by a tool (prompts, commands, code), product
  names, the terminal chrome (placeholder, `context left until auto-compact`), speaker notes
  (Ukrainian) and `index.html` meta (Ukrainian).
- Generated images with Ukrainian labels have no English variant yet — see the follow-ups in the
  alignment report; an English variant is `<name>-en.png` + its own `src/prompts/*.json`.
- `?lang=en` makes a shareable English link; `LANG_DECK=en bun run pdf` exports
  `dist/ai-first-code-review-agent-ua-en.pdf`.
- Verify a changed slide in BOTH languages — Ukrainian runs longer; fix overflow by rephrasing
  shorter, never by shrinking type.

## Verifying a change

Per the deck-engine skill: `bun run check`, then `bun run dev`, open the slide in Chrome, step
through **every** reveal and screenshot the last one. Overflow is measured across 1920×1080,
1728×850, 1280×720, 1024×768 and landscape phones (915×412, 844×390, 667×375) with a temporary
Playwright script (delete it afterwards).

## Image generation

Use the project `generate-image` skill: it delegates to `media:generate-image` (Gemini / ChatGPT in
the logged-in browser, no API key), saves the image to `src/assets/` and the prompt to
`src/prompts/<name>.json` (`filename`, `prompt`, `ratio`, `timestamp`, `model`) so it can be
regenerated.

## Troubleshooting

**`bun install` hangs at "Resolving…"** — the lockfile points at a private registry. Diagnose
with `grep -n "artifactory" bun.lock`; fix with
`rm -rf bun.lock bun.lockb node_modules && bun install`. (Regenerated 2026-11-04 against the
public registry; CI pins bun 1.4.2 to read it.)

**`pngquant-bin` postinstall fails / `bun run build` dies with `spawn Unknown system error -86`
on Apple Silicon** — the downloaded `node_modules/pngquant-bin/vendor/pngquant` is an x86_64
binary. Delete it: imagemin then logs an error per PNG and the build finishes (CI compresses
normally on Linux).

## Git

Never commit directly to `main`: short-lived feature branch → commit (`Add/Update/Fix/Remove …`,
AI co-author footer) → merge to `main` → push. The pre-commit hook runs `bun run check` and
refuses unstaged changes it would read. Pushes need the personal `yermilov` account; switch to it
ONLY for the git operation and back immediately: `gh auth switch --user yermilov`, push, then
`gh auth switch --user yaroslav-yermilov`.
