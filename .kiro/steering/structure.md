# Project Structure & Organization

## Directory Structure

### Core Application (`src/`)
```
src/
├── app/                    # App Router pages (Next.js 13+ structure)
├── pages/                  # Pages Router (legacy structure still in use)
├── components/             # Reusable UI components
├── layout/                 # Layout components
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── data/                   # Static data and configuration
├── utility/                # Utility functions and helpers
├── styles/                 # Global styles and CSS
├── animation/              # Animation components
└── scripts/                # Build and utility scripts
```

### Component Organization
- **Grouped by feature**: Components organized in feature-based folders
- **Atomic design**: Components range from basic utilities to complex features
- **Co-location**: Related components grouped together (e.g., `contact-form/`, `projects/`)

### Key Folders
- `src/components/utility/` - Reusable UI primitives
- `src/components/[feature]/` - Feature-specific components
- `src/data/` - Configuration, metadata, and static content
- `src/hooks/` - Custom hooks for reusable logic
- `src/utility/` - Pure functions and helpers
- `public/` - Static assets (images, icons, documents)

## File Naming Conventions
- **Components**: kebab-case (e.g., `landing-hero.tsx`)
- **Pages**: kebab-case (e.g., `about.tsx`)
- **Utilities**: camelCase (e.g., `classNames.ts`)
- **Data files**: camelCase (e.g., `siteMetaData.mjs`)
- **Types**: PascalCase interfaces/types

## Import Patterns
- Use path aliases: `@/` for `src/`
- Absolute imports preferred over relative
- Group imports: external libraries, then internal modules
- Dynamic imports for performance-critical components

## Asset Organization
- `public/icons/` - Technology and UI icons (SVG format)
- `public/images/` - Photos and graphics
- `public/images/projects/` - Project screenshots and media
- Static files (robots.txt, sitemap.xml) auto-generated in `public/`

## Architecture Patterns
- **Pages Router**: Main routing via `src/pages/`
- **Layout system**: Centralized layout in `src/layout/`
- **Context providers**: Animation and theme state management
- **Custom hooks**: Reusable stateful logic
- **Data separation**: Static content in dedicated data files