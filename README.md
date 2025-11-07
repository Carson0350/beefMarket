# WagnerBeef - Bull Marketplace Platform

Professional bull breeding marketplace connecting ranchers with breeders.

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM (coming in Story 1.2)
- **Authentication:** NextAuth.js (coming in Story 1.3)
- **Image Storage:** Cloudinary (coming in Story 1.4)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
wagnerbeef/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript types
├── public/               # Static assets
├── docs/                 # Project documentation
└── bmad/                 # BMAD workflow system
```

## Documentation

- [PRD](./docs/PRD.md) - Product Requirements Document
- [Architecture](./docs/architecture.md) - Technical Architecture
- [Epics](./docs/epics.md) - Epic and Story Breakdown
- [UX Design](./docs/ux-design-specification.md) - UX Specifications

## Development Workflow

This project uses the BMAD (Better Method for Agile Development) workflow system for structured development.

## License

Private - All Rights Reserved
