# Task 1: Complete Homepage Hero Section - Learning Log

## Date
2025-12-10

## Key Learnings

### 1. Tailwind CSS with CSS Variables
**Issue:** Using `border-border` class which referenced undefined CSS variables from a ShadCN/UI setup pattern.

**Learning:** When using Tailwind utility classes that reference CSS custom properties, ensure those properties are defined in the tailwind.config or use standard Tailwind color classes instead.

**Solution:** Changed `border-border` to `border-gray-200` for simplicity.

### 2. Stripe SDK Initialization
**Issue:** Build failed because Stripe SDK was initialized at module load time, throwing an error when environment variables weren't available during static analysis.

**Learning:** For libraries that require environment variables, use lazy initialization patterns to defer errors to runtime instead of build time.

**Solution:** Created a `getStripe()` function that initializes the Stripe instance only when first called:
```typescript
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, { ... });
  }
  return stripeInstance;
}
```

### 3. ESLint React Entity Escaping
**Issue:** ESLint threw errors for unescaped quote characters in JSX.

**Learning:** React's JSX requires special characters like quotes to be escaped as HTML entities.

**Solution:** Used `&ldquo;` and `&rdquo;` instead of literal quote characters.

### 4. CSS Animation Staggering
**Learning:** Creating staggered animations in CSS requires multiple classes with different animation-delay values. Setting initial `opacity: 0` ensures elements are hidden before their animation starts.

**Pattern:**
```css
.animate-fade-in-delay-2 {
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
  opacity: 0;
}
```

### 5. Next.js Build Process
**Learning:** Next.js performs static analysis during build which can execute module-level code. Side effects at module load time (like API calls or environment variable checks) should be avoided.

### 6. Internationalization Best Practices
**Learning:** When updating i18n content:
- Keep message keys consistent across all locales
- Update all language files simultaneously to avoid missing translations
- Use similar structure/length for translated content to maintain layout consistency

## Best Practices Established

1. **Always test builds** before committing changes
2. **Use lazy initialization** for external service clients
3. **Keep CSS animations in a central location** for reusability
4. **Escape special characters** in JSX content
5. **Update all locale files** when changing i18n content

## References
- [Next.js Static Generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)
- [Tailwind CSS Animation](https://tailwindcss.com/docs/animation)
- [ESLint react/no-unescaped-entities](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md)
