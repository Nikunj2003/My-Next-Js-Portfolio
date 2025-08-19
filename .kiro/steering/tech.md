# Technology Stack

## Core Framework & Libraries
- **Next.js 15** - React framework with SSR/SSG capabilities
- **React 18.2** - UI library with hooks and modern patterns
- **TypeScript 5.1** - Type-safe JavaScript with strict configuration
- **Tailwind CSS 3.3** - Utility-first CSS framework with custom design system
- **Framer Motion 10** - Animation library for smooth transitions and interactions

## Key Dependencies
- **next-themes** - Theme switching (dark/light mode)
- **Formik + Yup** - Form handling and validation
- **Nodemailer** - Email functionality for contact forms
- **next-seo** - SEO optimization
- **Lucide React** - Icon library
- **@vercel/analytics** - Analytics integration

## Development Tools
- **Prettier** - Code formatting with Tailwind plugin
- **ESLint** - Code linting via Next.js
- **Bundle Analyzer** - Build analysis
- **Sharp** - Image optimization

## Build System & Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Utilities
```bash
npm run sitemap      # Generate sitemap.xml and robots.txt
npm run analyze      # Bundle analysis (set ANALYZE=true)
npm run format:check # Check code formatting
npm run format:fix   # Fix code formatting
```

## Configuration Notes
- Uses path aliases: `@/*` maps to `./src/*`
- SVG files processed via @svgr/webpack
- Custom Tailwind theme with CSS variables for theming
- Image optimization with Sharp
- Static asset caching headers configured
- Bundle analysis available via environment variable