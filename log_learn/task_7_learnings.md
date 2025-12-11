# Task 7: Pricing Preview and FAQ - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. HTML Details/Summary for Accordions
**Pattern:** Native HTML accordion without JavaScript

```tsx
<details className="group">
  <summary className="flex items-center justify-between">
    Question text
    <ChevronDown className="transition-transform group-open:rotate-180" />
  </summary>
  <p className="mt-4">Answer text</p>
</details>
```

Benefits:
- Zero JavaScript required
- Accessible by default
- Works without hydration
- Built-in keyboard navigation

Tailwind integration:
- `group` class on details element
- `group-open:` modifier for open state styles
- `transition-transform` for smooth chevron rotation

### 2. Icon Association in Arrays
**Pattern:** Assign icons to array items for mapping

```tsx
{[
  { q: t('faq.items.1.question'), a: t('faq.items.1.answer'), icon: Shield },
  { q: t('faq.items.2.question'), a: t('faq.items.2.answer'), icon: Building2 },
].map((faq, index) => (
  <faq.icon className="h-5 w-5" />
))}
```

Key insight: Lucide React icons are components, so store the component reference (not a string) in the object.

### 3. Indented Content with Padding Left
**Pattern:** Align content with icon position

```tsx
<summary className="flex items-center gap-4 p-5">
  <div className="w-10 h-10 ...">Icon</div>  {/* 40px icon */}
  <span>Question</span>
</summary>
<div className="px-5 pb-5 pl-[4.5rem]">  {/* 72px = 20px padding + 40px icon + 12px gap */}
  <p>Answer aligned with question</p>
</div>
```

Calculation: `pl-[4.5rem]` = p-5 (20px) + icon width (40px) + gap-4 (16px) ≈ 72px

### 4. Two-Column Pricing Card
**Pattern:** Split information and features

```tsx
<div className="grid md:grid-cols-2 gap-8 items-center">
  <div>
    {/* Pricing info: price, CTA */}
  </div>
  <div>
    {/* Feature list with checkmarks */}
  </div>
</div>
```

Benefits:
- Clear visual hierarchy
- Balanced layout
- CTA near price
- Features reinforce value

### 5. Gradient Accent Bar
**Pattern:** Top border as visual accent

```tsx
<div className="rounded-2xl overflow-hidden">
  <div className="h-2 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500" />
  <div className="p-8">Content</div>
</div>
```

Key: Use `overflow-hidden` on parent to clip gradient to rounded corners.

### 6. Feature Checkmark List
**Pattern:** Green checkmarks for included features

```tsx
<div className="flex items-center gap-3">
  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
    <CheckCircle className="h-4 w-4 text-green-600" />
  </div>
  <span>{feature}</span>
</div>
```

Elements:
- Rounded container (bg-green-100)
- Contrasting icon (text-green-600)
- Consistent spacing (gap-3)

### 7. Hover State on Card Border
**Pattern:** Subtle interaction feedback

```tsx
className="border border-gray-200 hover:border-brand-300 transition-colors"
```

Why `border-brand-300` instead of `border-brand-500`:
- More subtle effect
- Less jarring transition
- Still visible feedback

## Best Practices Established

1. **Use native HTML elements** - details/summary for accordions
2. **Icon + text pairs** - Visual anchors help scanning
3. **Consistent padding math** - Calculate alignment carefully
4. **Gradient accents** - Draw attention to key sections
5. **Feature lists with checkmarks** - Universal "included" symbol

## Design Pattern: FAQ Section

Essential elements:
1. Clear question (bold, left-aligned)
2. Visual anchor (icon or number)
3. Expand/collapse indicator (chevron)
4. Readable answer (proper line-height, indented)
5. Hover feedback (border or background change)
6. Contact fallback (CTA for unanswered questions)

## References
- [HTML Details Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [Tailwind Group Modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state)
