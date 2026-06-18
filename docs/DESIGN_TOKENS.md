# Design Tokens

## Spacing Scale

Allowed spacing tokens:
4, 6, 8, 12, 16, 24, 32

Avoid arbitrary values.

---

## Container Widths

max-w-3xl → reading content
max-w-4xl → support sections
max-w-5xl → primary sections

Avoid:
- max-w-7xl
- ultra-wide layouts

---

## Typography Scale

h1 → text-5xl md:text-7xl
h2 → text-3xl
h3 → text-xl
body → text-base
small → text-sm

---

## Motion Tokens

duration-enter → 500ms
duration-subtle → 300ms
easing → easeOut

Avoid:
- durations > 800ms
- component-specific easing

---

## Elevation Rules

shadow-sm → subtle interaction
shadow-md → cards only

Avoid:
- shadow-lg overuse

---

## Border Radius

rounded-md → controls
rounded-xl → sections/cards

Avoid:
- excessive rounding
- rounded-2xl overuse

---

## Layering Rules

z-10 → floating navigation
z-20 → overlays

Avoid:
- z-30+
- stacking escalation