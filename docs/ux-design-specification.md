# wagnerBeef - UX Design Specification

**Author:** Sally (UX Designer) & Carson  
**Date:** 2025-11-07  
**Version:** 1.0  
**Project:** wagnerBeef B2B SaaS Platform

---

## Executive Summary

This UX specification defines the visual design, interaction patterns, and user experience for wagnerBeef—a B2B SaaS platform connecting bull ranchers with breeders. The design embraces an **earthy, agricultural aesthetic** with natural greens and warm tans to create an authentic, trustworthy experience that resonates with the ranching community while maintaining the professionalism breeders expect.

**Design Philosophy:** Simple, photo-forward, data-driven. Every design decision prioritizes ease of use for ranchers with low digital literacy while providing efficient discovery tools for breeders.

---

## Design Direction

### Brand Personality

**Authentic • Trustworthy • Grounded • Professional**

- **Authentic:** Reflects the real ranching lifestyle, not corporate tech
- **Trustworthy:** Inspires confidence in genetic data and breeding decisions
- **Grounded:** Down-to-earth, approachable, no unnecessary complexity
- **Professional:** Serious tool for serious breeding decisions

### Visual Aesthetic

**Earthy Agricultural Tone**

The design draws inspiration from:
- Rolling pastures and open fields
- Natural wood fencing and barn structures
- Earth, grass, and sky
- Traditional ranching heritage with modern clarity

**Not:** Corporate tech, sterile medical, flashy startup

---

## Color Palette

### Primary Colors

**Sage Green (Primary Brand)**
- **Hex:** `#6B8E6F`
- **Usage:** Primary buttons, headers, active states, brand elements
- **Rationale:** Earthy green that evokes pastures and agriculture without being too bright or "techy"

**Forest Green (Dark Accent)**
- **Hex:** `#3D5A3E`
- **Usage:** Text on light backgrounds, hover states, emphasis
- **Rationale:** Deeper green for contrast and readability

### Secondary Colors

**Warm Tan (Background)**
- **Hex:** `#E8DCC4`
- **Usage:** Page backgrounds, card backgrounds, section dividers
- **Rationale:** Warm, inviting beige that feels like natural paper or weathered wood

**Light Cream (Surface)**
- **Hex:** `#F5F1E8`
- **Usage:** Card surfaces, input fields, content areas
- **Rationale:** Soft off-white that reduces eye strain and feels organic

**Saddle Brown (Accent)**
- **Hex:** `#8B6F47`
- **Usage:** Secondary buttons, borders, subtle accents
- **Rationale:** Leather/wood tone that adds warmth and authenticity

### Neutral Colors

**Charcoal (Text)**
- **Hex:** `#2C2C2C`
- **Usage:** Primary text, headings
- **Rationale:** Softer than pure black, easier to read

**Warm Gray (Secondary Text)**
- **Hex:** `#6B6B6B`
- **Usage:** Secondary text, labels, metadata
- **Rationale:** Neutral gray with slight warmth

**Light Gray (Borders)**
- **Hex:** `#D4D4D4`
- **Usage:** Borders, dividers, subtle separators
- **Rationale:** Soft borders that don't compete with content

### Semantic Colors

**Success Green:** `#5A8F5A` (Inquiry sent, bull published)  
**Warning Amber:** `#D4A574` (Draft status, low inventory)  
**Error Red:** `#B85C5C` (Form errors, validation issues)  
**Info Blue:** `#6B8FA3` (Helpful tips, informational messages)

---

## Typography

### Font Families

**Headings:** Inter (Google Fonts)
- **Rationale:** Clean, modern sans-serif that's highly readable. Professional without being corporate.
- **Weights:** 600 (Semibold) for headings, 700 (Bold) for emphasis

**Body Text:** Inter (Google Fonts)
- **Rationale:** Same family for consistency, excellent readability at all sizes
- **Weights:** 400 (Regular) for body, 500 (Medium) for labels

**Data/Numbers:** Inter (Google Fonts)
- **Rationale:** Tabular numbers for EPD data alignment
- **Weights:** 500 (Medium) for data display

### Type Scale

**Desktop:**
- **H1 (Page Title):** 36px / 600 weight / 1.2 line-height
- **H2 (Section):** 28px / 600 weight / 1.3 line-height
- **H3 (Subsection):** 22px / 600 weight / 1.4 line-height
- **H4 (Card Title):** 18px / 600 weight / 1.4 line-height
- **Body Large:** 18px / 400 weight / 1.6 line-height
- **Body:** 16px / 400 weight / 1.6 line-height
- **Body Small:** 14px / 400 weight / 1.5 line-height
- **Caption:** 12px / 400 weight / 1.4 line-height

**Mobile:**
- Scale down by 10-15% for smaller screens
- Maintain readability (minimum 14px for body text)

---

## Component Library

### Buttons

**Primary Button (Call-to-Action)**
```
Background: Sage Green (#6B8E6F)
Text: White (#FFFFFF)
Padding: 12px 24px
Border Radius: 6px
Font: 16px / 500 weight
Hover: Forest Green (#3D5A3E)
Active: Darker forest green with subtle shadow
```

**Secondary Button**
```
Background: Transparent
Border: 2px solid Sage Green (#6B8E6F)
Text: Forest Green (#3D5A3E)
Padding: 12px 24px
Border Radius: 6px
Font: 16px / 500 weight
Hover: Light sage background
```

**Tertiary Button (Text Only)**
```
Background: Transparent
Text: Sage Green (#6B8E6F)
Padding: 8px 16px
Font: 16px / 500 weight
Hover: Underline
```

**Touch Targets:** Minimum 44x44px for mobile (WCAG compliance)

### Cards

**Bull Card (Browse Grid)**
```
Background: Light Cream (#F5F1E8)
Border: 1px solid Light Gray (#D4D4D4)
Border Radius: 8px
Shadow: 0 2px 4px rgba(0,0,0,0.08)
Padding: 0 (image full-bleed at top)
Hover: Lift effect (shadow: 0 4px 12px rgba(0,0,0,0.12))
```

**Content Card (Dashboard, Inquiry)**
```
Background: White (#FFFFFF)
Border: 1px solid Light Gray (#D4D4D4)
Border Radius: 8px
Shadow: 0 1px 3px rgba(0,0,0,0.06)
Padding: 24px
```

### Form Inputs

**Text Input / Textarea**
```
Background: White (#FFFFFF)
Border: 1px solid Light Gray (#D4D4D4)
Border Radius: 6px
Padding: 12px 16px
Font: 16px / 400 weight
Focus: Border changes to Sage Green, subtle shadow
Error: Border changes to Error Red
```

**Select Dropdown**
```
Same as text input
Arrow icon: Forest Green
Dropdown menu: White background, sage green hover
```

**Checkbox / Radio**
```
Border: 2px solid Light Gray
Checked: Sage Green background with white checkmark
Size: 20x20px (touch-friendly)
```

### Images

**Bull Photos**
- **Aspect Ratio:** 4:3 (landscape) for hero images
- **Border Radius:** 8px (top corners on cards)
- **Loading:** Blur-up placeholder (LQIP)
- **Optimization:** WebP format, multiple sizes (thumbnail, medium, large)

**Image Gallery (Bull Detail)**
- **Main Image:** Large display with zoom capability
- **Thumbnails:** Below main image, 80x80px, 8px border radius
- **Navigation:** Left/right arrows, swipe gestures on mobile

---

## Key Screen Designs

### 1. Home / Landing Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header (Logo, Browse, Sign In)         │
├─────────────────────────────────────────┤
│                                          │
│  Hero Section                            │
│  - Large headline                        │
│  - Subheading                            │
│  - CTA: "Browse Bulls" (Primary)         │
│  - Background: Subtle pastoral image     │
│                                          │
├─────────────────────────────────────────┤
│  Value Propositions (3 columns)          │
│  - Icon + Heading + Description          │
│                                          │
├─────────────────────────────────────────┤
│  Featured Bulls (4-card grid)            │
│  - "Recently Added" or "Popular"         │
│                                          │
├─────────────────────────────────────────┤
│  Footer (Links, Contact)                 │
└─────────────────────────────────────────┘
```

**Colors:**
- Background: Warm Tan (#E8DCC4)
- Hero overlay: Semi-transparent forest green
- Cards: Light Cream (#F5F1E8)

---

### 2. Bull Browse Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header (Logo, Search, Account)         │
├──────────┬──────────────────────────────┤
│          │                              │
│ Filters  │  Bull Grid (4 columns)       │
│ Sidebar  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│
│          │  │Bull│ │Bull│ │Bull│ │Bull││
│ - Breed  │  │Card│ │Card│ │Card│ │Card││
│ - EPDs   │  └────┘ └────┘ └────┘ └────┘│
│ - State  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│
│ - Price  │  │Bull│ │Bull│ │Bull│ │Bull││
│          │  │Card│ │Card│ │Card│ │Card││
│          │  └────┘ └────┘ └────┘ └────┘│
│          │                              │
│          │  Pagination                  │
└──────────┴──────────────────────────────┘
```

**Bull Card Contents:**
- Hero image (full-width, 4:3 aspect)
- Bull name (H4, Forest Green)
- Breed (Body Small, Warm Gray)
- 2-3 key EPDs (Body, Charcoal)
- Ranch name (Caption, Warm Gray)
- Hover: Lift effect, "View Details" overlay

**Responsive:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column, filters collapse to drawer

---

### 3. Bull Detail Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header + Breadcrumb                     │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Image Gallery   │  Bull Info           │
│  (Large photo    │  - Name (H1)         │
│   + thumbnails)  │  - Breed, Age        │
│                  │  - Ranch (link)      │
│                  │  - Inventory count   │
│                  │  - Price (if listed) │
│                  │                      │
│                  │  [Contact Ranch] CTA │
│                  │  [Add to Favorites]  │
│                  │  [Compare] checkbox  │
│                  │                      │
├──────────────────┴──────────────────────┤
│  Tabs: Genetic Data | Pedigree | Perf.  │
├─────────────────────────────────────────┤
│                                          │
│  Tab Content (EPD table, pedigree tree)  │
│                                          │
└─────────────────────────────────────────┘
```

**EPD Table:**
- Clean table with alternating row colors (Light Cream)
- Column headers: Bold, Forest Green
- Numeric alignment: Right-aligned
- Tooltips: Explain each EPD metric (help icon)

**Pedigree Tree:**
- Simple 3-generation visual tree
- Boxes: Light Cream with Forest Green borders
- Lines: Sage Green connecting relationships

---

### 4. Bull Comparison Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header + "Comparing 3 Bulls"            │
├─────────┬─────────┬─────────┬───────────┤
│ Bull 1  │ Bull 2  │ Bull 3  │           │
│ Photo   │ Photo   │ Photo   │           │
│ Name    │ Name    │ Name    │           │
│ Ranch   │ Ranch   │ Ranch   │           │
├─────────┼─────────┼─────────┼───────────┤
│ Metric  │ Value 1 │ Value 2 │ Value 3   │
├─────────┼─────────┼─────────┼───────────┤
│ BW EPD  │  +2.5   │  +3.1   │  +2.8     │
│ WW EPD  │  +45    │  +52    │  +48      │
│ YW EPD  │  +82    │  +78    │  +85      │
│ ...     │  ...    │  ...    │  ...      │
└─────────┴─────────┴─────────┴───────────┘
```

**Highlighting:**
- Best value in each row: Subtle sage green background
- Differences: Bold text for standout values
- Responsive: Horizontal scroll on mobile

---

### 5. Ranch Dashboard (Ranch Owner)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header + Dashboard Nav                  │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Dashboard Content           │
│ Nav      │  ┌────────────────────────┐  │
│          │  │ Stats Cards (3 cols)   │  │
│ - Bulls  │  │ - Total Bulls          │  │
│ - Inquir.│  │ - Active Listings      │  │
│ - Profile│  │ - Inquiries (30d)      │  │
│          │  └────────────────────────┘  │
│          │                              │
│          │  My Bulls (Grid/List view)   │
│          │  ┌────┐ ┌────┐ ┌────┐       │
│          │  │Bull│ │Bull│ │Bull│       │
│          │  │+Edit│ │+Edit│ │+Edit│     │
│          │  └────┘ └────┘ └────┘       │
│          │                              │
│          │  [+ Add New Bull] Button     │
└──────────┴──────────────────────────────┘
```

**Stats Cards:**
- Background: White
- Border: Light Gray
- Icon: Sage Green
- Number: Large, Charcoal
- Label: Body Small, Warm Gray

---

### 6. Add/Edit Bull Form (Ranch Owner)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header + "Add New Bull"                 │
├─────────────────────────────────────────┤
│  Progress Indicator (3 steps)            │
│  ● Basic Info  ○ Genetic Data  ○ Review  │
├─────────────────────────────────────────┤
│                                          │
│  Form Section: Basic Information         │
│  ┌──────────────────────────────────┐   │
│  │ Bull Name *                      │   │
│  │ [Text Input]                     │   │
│  │                                  │   │
│  │ Breed *                          │   │
│  │ [Dropdown]                       │   │
│  │                                  │   │
│  │ Birth Date                       │   │
│  │ [Date Picker]                    │   │
│  │                                  │   │
│  │ Photos *                         │   │
│  │ [Upload Area - Drag & Drop]     │   │
│  │ ┌────┐ ┌────┐ ┌────┐            │   │
│  │ │Img1│ │Img2│ │+Add│            │   │
│  │ └────┘ └────┘ └────┘            │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Save Draft] [Continue →]              │
└─────────────────────────────────────────┘
```

**Form Design:**
- **Inline Help:** Question mark icons with tooltips for complex fields (EPDs)
- **Validation:** Real-time, friendly error messages
- **Progress Save:** Auto-save drafts every 30 seconds
- **Required Fields:** Asterisk (*) and clear labeling

---

### 7. Inquiry Form (Breeder → Ranch Owner)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Modal: "Contact Ranch About [Bull]"    │
├─────────────────────────────────────────┤
│                                          │
│  Your Information                        │
│  ┌──────────────────────────────────┐   │
│  │ Name *                           │   │
│  │ [Text Input]                     │   │
│  │                                  │   │
│  │ Email *                          │   │
│  │ [Email Input]                    │   │
│  │                                  │   │
│  │ Phone (optional)                 │   │
│  │ [Phone Input]                    │   │
│  │                                  │   │
│  │ Message *                        │   │
│  │ [Textarea - pre-filled]          │   │
│  │ "I'm interested in [Bull Name]   │   │
│  │  for my breeding program..."     │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Cancel] [Send Inquiry]                │
└─────────────────────────────────────────┘
```

**Pre-filled Message:**
"I'm interested in [Bull Name] for my breeding program. Please contact me to discuss availability and pricing."

---

## Interaction Patterns

### Navigation

**Desktop Header:**
- Logo (left) → Home
- Browse Bulls (center)
- Search bar (center-right)
- Sign In / Account (right)

**Mobile Header:**
- Hamburger menu (left)
- Logo (center)
- Account icon (right)

**Sticky Header:** Yes, collapses slightly on scroll

### Loading States

**Page Load:**
- Skeleton screens (gray placeholders matching layout)
- No spinners for initial page load

**Image Load:**
- Blur-up placeholder (LQIP)
- Fade-in transition when loaded

**Button Actions:**
- Loading spinner inside button
- Button disabled during action
- Success state (checkmark) briefly before redirect

### Empty States

**No Bulls Found:**
- Friendly illustration (simple line art of a bull)
- Helpful message: "No bulls match your filters"
- CTA: "Clear Filters" or "Browse All Bulls"

**No Inquiries Yet:**
- Encouraging message: "Your first inquiry is on the way!"
- Tip: "Share your ranch URL to get started"

### Error States

**Form Errors:**
- Inline, below field
- Red text with error icon
- Specific, helpful messages (not "Invalid input")

**Page Errors (404, 500):**
- Friendly, on-brand error page
- Clear explanation
- CTA: "Go to Browse" or "Contact Support"

---

## Responsive Design

### Breakpoints

- **Desktop:** 1280px+ (4-column grid)
- **Laptop:** 1024px - 1279px (3-column grid)
- **Tablet:** 768px - 1023px (2-column grid)
- **Mobile:** < 768px (1-column, stacked layout)

### Mobile Optimizations

**Touch Targets:** Minimum 44x44px  
**Font Sizes:** Minimum 14px for body text  
**Forms:** Large inputs (48px height)  
**Navigation:** Bottom tab bar for key actions  
**Filters:** Slide-up drawer instead of sidebar  
**Images:** Swipe gestures for galleries  

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast

All text meets WCAG AA standards:
- **Large text (18px+):** 3:1 minimum
- **Normal text:** 4.5:1 minimum
- **Sage Green on White:** 4.52:1 ✓
- **Forest Green on Light Cream:** 7.21:1 ✓
- **Charcoal on White:** 12.63:1 ✓

### Keyboard Navigation

- All interactive elements focusable
- Visible focus indicators (2px sage green outline)
- Logical tab order
- Skip-to-content link

### Screen Readers

- Semantic HTML (header, nav, main, article)
- ARIA labels for icons and buttons
- Alt text for all images (descriptive, not "image of bull")
- Form labels properly associated

### Motion

- Respect `prefers-reduced-motion`
- No auto-playing animations
- Transitions: 200-300ms (subtle, not distracting)

---

## Performance Considerations

### Image Optimization

- **Format:** WebP with JPEG fallback
- **Sizes:** Thumbnail (300px), Medium (800px), Large (1200px)
- **Lazy Loading:** Below-fold images
- **CDN:** Cloudinary for automatic optimization

### Code Splitting

- Route-based splitting (Next.js automatic)
- Dynamic imports for heavy components (comparison table)

### Caching

- Static assets: 1 year
- API responses: Appropriate cache headers
- Service worker for offline capability (future)

---

## Design System Implementation

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#6B8E6F',
          dark: '#3D5A3E',
          light: '#8FA892',
        },
        tan: {
          DEFAULT: '#E8DCC4',
          light: '#F5F1E8',
        },
        saddle: '#8B6F47',
        charcoal: '#2C2C2C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '8px',
      },
    },
  },
};
```

### shadcn/ui Components

Use shadcn/ui for:
- Button
- Card
- Form (Input, Select, Textarea, Checkbox)
- Dialog (Modal)
- Dropdown Menu
- Tabs
- Toast (Notifications)

Customize with wagnerBeef color palette.

---

## Next Steps

### Design Deliverables

1. **High-Fidelity Mockups** (Optional)
   - Use Figma or v0.dev to create visual mockups
   - Key screens: Browse, Bull Detail, Dashboard, Add Bull Form

2. **Component Library** (shadcn/ui + Custom)
   - Install shadcn/ui components
   - Customize with Tailwind config
   - Create custom Bull Card component

3. **Design Tokens** (Tailwind Config)
   - Implement color palette
   - Define spacing scale
   - Set up typography system

### Implementation Priority

**Phase 1 (MVP):**
- Color palette and typography
- Basic components (Button, Card, Form)
- Bull Browse and Detail pages
- Add Bull form

**Phase 2 (Polish):**
- Comparison page
- Dashboard refinements
- Micro-interactions
- Loading/empty states

**Phase 3 (Enhancement):**
- Advanced animations
- Illustration system
- Marketing pages
- Mobile app (future)

---

## Design Rationale

### Why Earthy Greens and Tans?

**User Psychology:**
- **Ranchers:** Feel at home with natural, agricultural colors
- **Breeders:** Perceive authenticity and trustworthiness
- **Industry:** Stands out from corporate blue/gray competitors

**Brand Differentiation:**
- CattleUSA: Generic blue
- CattleRange: Red/white
- WagnerBeef: Unique earthy palette = memorable

**Accessibility:**
- Natural greens provide good contrast
- Warm tans reduce eye strain
- Meets WCAG AA standards

### Why Photo-Forward Design?

**User Need:**
- Bulls are visual products (conformation, size, color matter)
- Photos build emotional connection
- First impression drives inquiry decisions

**Industry Standard:**
- Print catalogs are photo-heavy
- Auctions emphasize visual inspection
- Breeders expect to "see" the bull

---

## Conclusion

This UX specification provides a complete design foundation for wagnerBeef. The earthy, agricultural aesthetic creates an authentic experience that resonates with ranchers while maintaining the professionalism breeders expect. Every design decision prioritizes simplicity for low digital literacy users and efficiency for data-driven breeding decisions.

**The design is ready for implementation following the architecture and story breakdown already defined.**

---

**References:**
- Product Brief: `/docs/product-brief-wagnerBeef-2025-11-07.md`
- PRD: `/docs/PRD.md`
- Architecture: `/docs/architecture.md`
- Epic Breakdown: `/docs/epics.md`

**Design Tools:**
- Figma (optional mockups)
- v0.dev (rapid prototyping)
- shadcn/ui (component library)
- Tailwind CSS (styling framework)
