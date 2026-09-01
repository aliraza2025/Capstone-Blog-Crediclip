# Portfolio & Work — Style Guide

A concise reference for all visual decisions used in the Portfolio section.

---

## Typography

| Role              | Family                   | Weight | Size (desktop)   | Size (mobile)    |
|-------------------|--------------------------|--------|------------------|------------------|
| Section title     | Inter                    | 700    | clamp(1.75–2.5rem) | ~1.75rem       |
| Subtitle          | Inter                    | 400    | 1rem             | 1rem             |
| Section tag pill  | Inter                    | 600    | 0.75rem          | 0.75rem          |
| Card title        | Inter                    | 600    | 0.975rem         | 0.975rem         |
| Card description  | Inter                    | 400    | 0.825rem         | 0.825rem         |

**Fallback stack:** `'Inter', system-ui, -apple-system, sans-serif`

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

---

## Color Palette

| Token               | Hex       | Usage                                      |
|---------------------|-----------|--------------------------------------------|
| `--color-bg`        | `#F9FAFB` | Page background                            |
| `--color-surface`   | `#FFFFFF` | Card background, nav bar                  |
| `--color-border`    | `#E5E7EB` | Default card border, dividers              |
| `--color-border-hover` | `#BFDBFE` | Card border on hover                    |
| `--color-text-primary` | `#111827` | Headings, card titles, nav logo          |
| `--color-text-muted`   | `#6B7280` | Subtitles, descriptions, nav links       |
| `--color-text-faint`   | `#9CA3AF` | Arrow icon default, footer text          |
| `--color-accent`    | `#2563EB` | Section tag, icon color, divider bar, hover states |
| `--color-accent-light` | `#EFF6FF` | Icon background fill                    |
| `--color-accent-mid`   | `#DBEAFE` | Icon background on hover                |
| `--color-accent-border`| `#BFDBFE` | Icon container border, pill border      |

**Gradient** (card top-edge accent on hover):
```css
background: linear-gradient(90deg, #2563EB, #60A5FA);
```

---

## Spacing Scale

| Token   | Value   | Used for                              |
|---------|---------|---------------------------------------|
| `xs`    | 0.3rem  | Internal card gap (title → description) |
| `sm`    | 0.75rem | Card internal gap                     |
| `md`    | 1.25rem | Grid column/row gap                   |
| `lg`    | 1.5rem  | Card padding, section tag margin      |
| `xl`    | 3rem    | Section header bottom margin          |
| `2xl`   | 5rem    | Section top padding (desktop)         |
| `3xl`   | 6rem    | Section bottom padding (desktop)      |

---

## Border Radii

| Element     | Radius  |
|-------------|---------|
| Card        | `14px`  |
| Icon box    | `10px`  |
| Pill / tag  | `999px` |
| Divider bar | `999px` |

---

## Shadows

| State     | Value                                                                 |
|-----------|-----------------------------------------------------------------------|
| Default   | none                                                                  |
| Hover     | `0 12px 32px -4px rgba(0,0,0,0.10), 0 4px 10px -2px rgba(0,0,0,0.06)` |

---

## Animations & Transitions

| Effect              | Property           | Duration | Easing                             |
|---------------------|--------------------|----------|------------------------------------|
| Card lift           | `transform: translateY(-4px)` | 220ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring) |
| Card shadow/border  | `box-shadow`, `border-color` | 220ms | `ease`                       |
| Top-edge gradient   | `transform: scaleX(1)` | 280ms | `ease`                           |
| Icon bg tint        | `background`       | 200ms    | `ease`                             |
| Arrow nudge         | `transform: translate(3px,-3px)`, `color` | 200ms | `ease`     |

---

## Accessibility

- All cards use `<a>` elements — fully keyboard-navigable.
- `aria-label` on each card includes "(opens in new tab)" notice.
- `rel="noopener noreferrer"` on all external links.
- `:focus-visible` ring: `2px solid #2563EB`, `outline-offset: 3px`.
- Decorative SVGs and dividers marked `aria-hidden="true"`.
- Color contrast ratios meet WCAG AA:
  - `#111827` on `#FFFFFF`: ≈ 16:1 ✓
  - `#6B7280` on `#FFFFFF`: ≈ 5.9:1 ✓
  - `#2563EB` on `#EFF6FF`: ≈ 5.7:1 ✓

---

## Responsive Breakpoints

| Breakpoint   | Grid columns | Padding             |
|--------------|--------------|---------------------|
| ≥ 769px      | 3 columns    | `5rem 2rem`         |
| 481–768px    | 2 columns    | `5rem 2rem`         |
| ≤ 480px      | 1 column     | `3.5rem 1.25rem`    |

---

## File Reference

| File                    | Purpose                                              |
|-------------------------|------------------------------------------------------|
| `index.html`            | Self-contained full-page preview (open in browser)   |
| `portfolio-section.html`| Drop-in `<section>` + scoped CSS for existing sites  |
| `style-guide.md`        | This file — design token reference                   |
