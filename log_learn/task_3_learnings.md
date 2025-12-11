# Task 3: Build Problem/Solution Section - Learning Log

## Date
2025-12-10

## Key Learnings

### 1. CSS Absolute Positioning for Overlays
**Technique:** Use absolute positioning with transform for centering overlays

```tsx
<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
```

This pattern:
- Places element at 50% from left and top
- Translates back by 50% of its own dimensions
- Results in perfect centering regardless of overlay size

### 2. items-stretch vs items-start for Grid Cards
**Learning:** Use `items-stretch` to make grid children equal height

```tsx
<div className="grid md:grid-cols-2 items-stretch">
```

- `items-start`: Cards only as tall as their content (default)
- `items-stretch`: Cards stretch to match the tallest sibling

For comparison layouts, equal height cards look more balanced.

### 3. Gradient Backgrounds for Depth
**Technique:** Use diagonal gradients for subtle depth

```tsx
className="bg-gradient-to-br from-red-50 to-white"
```

- `gradient-to-br`: Bottom-right direction
- From colored to white creates a subtle "lifted" effect
- Complements shadow for layered appearance

### 4. Hover States with Opacity
**Learning:** Use color with opacity for subtle hover backgrounds

```tsx
className="hover:bg-red-50/50"
```

- `/50` sets 50% opacity on the background color
- Creates subtle highlight without being overwhelming
- Works well with existing text colors

### 5. Icon Container Sizing
**Pattern:** Square containers with centered icons

```tsx
<div className="w-10 h-10 rounded-lg flex items-center justify-center">
  <Icon className="h-5 w-5" />
</div>
```

Benefits:
- Consistent visual rhythm
- Icons don't touch container edges
- Backgrounds can show through corners

### 6. Responsive Visibility
**Pattern:** Hide/show elements based on breakpoint

```tsx
<div className="hidden md:flex">
```

- `hidden`: Display none by default
- `md:flex`: Display flex at md breakpoint and up

Use for decorative elements that don't make sense on mobile (like connecting arrows between columns that stack).

## Best Practices Established

1. **Use equal-height cards for comparisons** - Creates visual balance
2. **Add connecting visuals between related content** - Guides the eye
3. **Use subtle gradients for depth** - More refined than solid colors
4. **Include hover states for interactivity** - Provides feedback
5. **Consider mobile-first hiding** - Remove complexity on small screens

## Visual Design Pattern

The "Before/After" or "Problem/Solution" pattern:
- Left = negative/problem (red/warm colors)
- Right = positive/solution (green/cool colors)
- Arrow between = transformation/progress
- Equal sizing = balanced comparison

## References
- [Tailwind Grid](https://tailwindcss.com/docs/grid-template-columns)
- [CSS Transform Centering](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
