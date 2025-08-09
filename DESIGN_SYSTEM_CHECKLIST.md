# Torchlight Design System Checklist

## Pull Request Design Conformance Template

**Copy this checklist into every PR that touches UI components:**

---

### 🎨 Design System Conformance Checklist

_Before merging, the author AND reviewer must confirm all items below:_

#### **Core Sanctuary Palette Adherence**
- [ ] **Warm Charcoal Background**: All primary backgrounds use `var(--warm-charcoal)` or `hsl(30, 8%, 18%)`
- [ ] **Brushed Gold Interactions**: All interactive elements (buttons, links, focus states) use `var(--brushed-gold)`
- [ ] **Sage Teal Accents**: All informational/secondary elements use `var(--sage-teal)`
- [ ] **Warm Off-White Text**: All primary text uses `var(--warm-off-white)`
- [ ] **Warm Gray Structure**: All borders/dividers use `var(--warm-gray)`

#### **Forbidden Elements Check**
- [ ] **No Purple/Cosmic Colors**: Zero instances of purple, blue, or cosmic-themed colors
- [ ] **No Hardcoded Colors**: All colors use CSS variables, no hex/rgb hardcoding
- [ ] **No Fire Colors**: No red/orange/crimson that conflicts with sanctuary aesthetic
- [ ] **No Cosmic Class Names**: No `.cosmic-*` class names (use `.sanctuary-*` instead)

#### **Typography Conformance**
- [ ] **Inter Font Family**: All UI text uses `'Inter', sans-serif`
- [ ] **Playfair Logo Font**: Logo/brand elements use `'Playfair Display', serif`
- [ ] **Responsive Sizing**: Font sizes use `clamp()` for mobile responsiveness
- [ ] **16px Minimum**: All inputs use 16px minimum to prevent iOS zoom

#### **Mobile-First Standards**
- [ ] **44px Touch Targets**: All interactive elements meet minimum touch target size
- [ ] **Safe Area Support**: Uses `env(safe-area-inset-*)` for iPhone compatibility
- [ ] **iOS Optimization**: No elements that trigger unwanted zoom or scrolling
- [ ] **Responsive Design**: Component works seamlessly across all screen sizes

#### **Accessibility Compliance**
- [ ] **WCAG AAA Contrast**: Text maintains 16.8:1 contrast ratio against backgrounds
- [ ] **Focus Indicators**: All interactive elements have visible focus states
- [ ] **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
- [ ] **Keyboard Navigation**: Component is fully navigable via keyboard

#### **Sanctuary Philosophy Check**
- [ ] **Calm & Grounding**: Component feels serene and creates sanctuary atmosphere
- [ ] **Premium Quality**: Visual design suggests professional wellness platform
- [ ] **Trust-Building**: Nothing that feels entertainment-focused or gimmicky
- [ ] **Feminine Appeal**: Aesthetic appeals to women 20-60 seeking spiritual guidance

#### **Brand Consistency**
- [ ] **Logo Harmony**: If logo is present, uses sanctuary-aligned color scheme
- [ ] **No Design Drift**: Component maintains visual consistency with existing sanctuary elements
- [ ] **Cohesive Experience**: Feels like natural part of Torchlight ecosystem

---

### 🚨 Pre-Merge Requirements

**For UI-related PRs, the following must be completed:**

1. **Automated Audit**: Run `node audit-design-system.mjs` - must pass with 0 errors
2. **Manual Review**: All checklist items above marked as complete
3. **Reviewer Sign-off**: Second pair of eyes confirms sanctuary aesthetic
4. **Mobile Testing**: Component tested on actual mobile device
5. **Accessibility Testing**: Verified with screen reader/keyboard navigation

---

### 📋 Quick Reference: Sanctuary Design System

#### **Approved Color Variables**
```css
--warm-charcoal: hsl(30, 8%, 18%);     /* Primary backgrounds */
--brushed-gold: hsl(44, 45%, 65%);     /* Interactive elements */
--sage-teal: hsl(180, 25%, 55%);       /* Informational elements */
--warm-off-white: hsl(60, 10%, 96%);   /* Primary text */
--warm-gray: hsl(30, 5%, 66%);         /* Borders & structure */
```

#### **Typography Standards**
```css
/* UI Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Logo/Brand */
font-family: 'Playfair Display', serif;
font-weight: 700;
font-style: italic;
```

#### **Component Naming Convention**
- Use `.sanctuary-*` class names (e.g., `.sanctuary-button`, `.sanctuary-card`)
- Avoid `.cosmic-*`, `.mystic-*`, or entertainment-themed naming

---

### ✅ Success Criteria

**A successful design system implementation should:**
- Create immediate sense of calm and trust
- Feel premium and professional, not entertainment-focused
- Appeal specifically to women seeking spiritual wellness guidance
- Maintain perfect visual consistency across all components
- Support accessibility for all users
- Work flawlessly on mobile devices

**Remember**: We're building a wellness sanctuary, not a cosmic entertainment app. Every design decision should reinforce trust, professionalism, and spiritual depth.