# Dashboard Package

Next.js 14 dashboard for tracking Baseline adoption and analytics.

## Structure

```
dashboard/
├── src/
│   ├── app/            # Next.js 14 app router
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utilities and helpers
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── prisma/           # Database schema and migrations
└── package.json      # Dependencies
```

## Development

```bash
cd packages/dashboard
pnpm install
pnpm dev
pnpm build
```
