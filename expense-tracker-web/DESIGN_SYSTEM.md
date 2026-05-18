# Expense Tracker — Design System

> This document defines the visual design language for the Expense Tracker web app.  
> **Always use shadcn/ui components** — override their colors and styling via CSS variables and Tailwind classes, but never replace them with custom HTML/CSS equivalents.

---

## 🎨 Color Palette

Inspired by [Browser Use](https://browser-use.com) — a premium dark-first aesthetic.

### Core Colors

| Token                | Hex         | Usage                                      |
|----------------------|-------------|---------------------------------------------|
| `--background`       | `#0a0a0a`   | Page / app background                       |
| `--foreground`       | `#fafafa`   | Primary text on dark backgrounds             |
| `--card`             | `#111111`   | Card surfaces, sidebar background            |
| `--card-foreground`  | `#fafafa`   | Text on cards                                |
| `--popover`          | `#111111`   | Dialog / dropdown backgrounds                |
| `--popover-foreground`| `#fafafa`  | Text inside popovers                         |

### Accent & Interactive

| Token                | Hex         | Usage                                      |
|----------------------|-------------|---------------------------------------------|
| `--primary`          | `#f97316`   | Primary buttons, CTA, active indicators     |
| `--primary-foreground`| `#ffffff`  | Text on primary buttons                      |
| `--secondary`        | `#1c1c1c`   | Secondary buttons, subtle backgrounds        |
| `--secondary-foreground`| `#a1a1aa`| Text on secondary surfaces                   |
| `--accent`           | `#1a1a1a`   | Hover states, sidebar active item bg         |
| `--accent-foreground`| `#fafafa`   | Text on accent backgrounds                   |

### Semantic

| Token                | Hex         | Usage                                      |
|----------------------|-------------|---------------------------------------------|
| `--destructive`      | `#ef4444`   | Delete actions, error states                 |
| `--destructive-foreground`| `#fafafa`| Text on destructive elements              |
| `--muted`            | `#1c1c1c`   | Muted backgrounds (inputs, disabled areas)   |
| `--muted-foreground` | `#71717a`   | Placeholder text, secondary/muted text       |

### Borders & Rings

| Token                | Hex         | Usage                                      |
|----------------------|-------------|---------------------------------------------|
| `--border`           | `#222222`   | Card borders, dividers, input borders        |
| `--input`            | `#222222`   | Input field borders                          |
| `--ring`             | `#f97316`   | Focus ring color (matches primary)           |

### Chart Colors (for future data visualization)

| Token        | Hex         |
|--------------|-------------|
| `--chart-1`  | `#f97316`   |
| `--chart-2`  | `#fb923c`   |
| `--chart-3`  | `#fdba74`   |
| `--chart-4`  | `#fed7aa`   |
| `--chart-5`  | `#fff7ed`   |

---

## 🔤 Typography

### Font Families

| Role        | Font                  | Import                                        |
|-------------|------------------------|-----------------------------------------------|
| **Headline/Hero** | `Playfair Display` (serif) | Google Fonts: `Playfair+Display:wght@400;700;900&display=swap` |
| **Body/UI**       | `Inter` (sans-serif)       | Google Fonts: `Inter:wght@300;400;500;600;700&display=swap`    |
| **Monospace**     | System mono stack          | `ui-monospace, monospace`                     |

### Font Usage Rules

```
Hero headings       → Playfair Display, 900 weight, uppercase for impact lines
                      Italic variant for emphasis/cursive subheadings
Page headings (h1)  → Inter, 700 weight, 2rem (text-3xl)
Section headings (h2) → Inter, 600 weight, 1.5rem (text-2xl)
Subheadings (h3)    → Inter, 600 weight, 1.25rem (text-xl)
Body text           → Inter, 400 weight, 1rem (text-base)
Small/caption text  → Inter, 400 weight, 0.875rem (text-sm)
Muted text          → Inter, 400 weight, text-muted-foreground
```

### CSS Setup

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.font-serif {
  font-family: 'Playfair Display', serif;
}
```

---

## 📐 Spacing & Layout

### Border Radius

| Token          | Value    | Usage                  |
|----------------|----------|------------------------|
| `--radius`     | `0.5rem` | Default for all components (cards, buttons, inputs, dialogs) |

### Sidebar

| Property       | Value         |
|----------------|---------------|
| Width          | `250px`       |
| Background     | `var(--card)` / `#111111` |
| Border right   | `1px solid var(--border)` |
| Position       | Fixed left, full height   |

### Content Area

| Property       | Value         |
|----------------|---------------|
| Max width      | None (fluid, fills remaining space) |
| Padding        | `2rem` (`p-8`) |
| Background     | `var(--background)` |

### Page Structure

```
┌──────────────────────────────────────────────────┐
│  Landing: Full width, no sidebar, centered hero  │
└──────────────────────────────────────────────────┘

┌──────────┬───────────────────────────────────────┐
│          │  Top area: page title + actions        │
│ Sidebar  ├───────────────────────────────────────┤
│ 250px    │  Content area: cards, tables, etc.     │
│          │  Padding: p-8                          │
│          │                                        │
└──────────┴───────────────────────────────────────┘
```

---

## 🧩 Component Overrides

All components are **shadcn/ui** — we only override via CSS variables and Tailwind utility classes.

### Buttons

| Variant     | Appearance                                    |
|-------------|-----------------------------------------------|
| `default`   | Orange bg (`bg-primary`), white text           |
| `secondary` | Dark bg (`#1c1c1c`), gray text                |
| `outline`   | Transparent bg, `border-border`, white text on hover |
| `ghost`     | Transparent bg, subtle hover (`accent`)        |
| `destructive`| Red bg (`bg-destructive`), white text         |

**Hover behavior**: Buttons should have a slight brightness increase on hover (`hover:bg-primary/90`).

### Cards

- Background: `var(--card)` — `#111111`
- Border: `1px solid var(--border)` — `#222222`
- Border radius: `var(--radius)`
- No shadows (flat design to match dark theme)

### Dialog / Modal

- Overlay: semi-transparent black (`bg-black/80`)
- Content bg: `var(--card)` — `#111111`
- Border: `1px solid var(--border)`
- Max width: `425px` for forms, wider for data views

### Inputs

- Background: `var(--background)` or `transparent`
- Border: `1px solid var(--input)` — `#222222`
- Focus ring: `var(--ring)` — orange ring
- Placeholder text: `var(--muted-foreground)` — `#71717a`
- Text: `var(--foreground)` — white

### Table

- Header bg: `var(--muted)` — `#1c1c1c`
- Row borders: `1px solid var(--border)`
- Hover row: subtle `var(--accent)` background
- Text: `var(--foreground)`, muted columns use `var(--muted-foreground)`

### Sidebar Navigation

- Nav items: `text-muted-foreground` by default
- Active item: `text-foreground` with `bg-accent` background and orange left border accent
- Hover: `bg-accent` background
- Icons: Use `lucide-react` icons, sized `1rem` (w-4 h-4)

### Badges

| Variant     | Appearance                          |
|-------------|--------------------------------------|
| `default`   | Orange bg, white text                |
| `secondary` | Dark muted bg, gray text             |
| `outline`   | Transparent, bordered, white text    |
| `destructive`| Red bg, white text                  |

---

## ✨ Interactions & Animations

### Transitions

- All interactive elements: `transition-colors duration-200`
- Buttons: color transitions on hover/active
- Sidebar nav links: background color transition

### Hover States

- Buttons: slight brightness shift (`/90` opacity on hover)
- Table rows: subtle `accent` background
- Nav links: `accent` background fill
- Cards: No hover effect (static)

### Micro-animations

- Dialog: Default shadcn fade + scale in/out
- Page transitions: None for now (can add later with framer-motion)
- Loading states: Subtle pulse animation on skeleton components

---

## 🖼️ Iconography

- **Library**: `lucide-react`
- **Size**: `w-4 h-4` for inline / nav icons, `w-5 h-5` for card icons, `w-6 h-6` for hero/feature icons
- **Color**: Inherit from text color (`currentColor`)
- **Common icons used**:
  - `LayoutDashboard` — Dashboard nav
  - `Home` — Home nav
  - `Plus` — Add/upload expense
  - `Upload` — File upload
  - `Receipt` — Expenses
  - `DollarSign` — Amount / money
  - `Calendar` — Date
  - `TrendingUp` — Stats / trends
  - `User` — Profile

---

## 📋 Design Checklist (for every new page/component)

- [ ] Uses only shadcn/ui components (Button, Card, Dialog, Table, Input, etc.)
- [ ] Colors come from CSS variables, not hardcoded hex
- [ ] Text uses Inter (body) or Playfair Display (hero only)
- [ ] Dark background throughout — no white/light sections
- [ ] Primary actions are orange (`bg-primary`)
- [ ] Muted/secondary text uses `text-muted-foreground`
- [ ] Inputs have orange focus rings
- [ ] Icons from `lucide-react`, sized correctly
- [ ] Generous spacing — not cramped
- [ ] Feels premium and minimal — no unnecessary decoration
