# Coding Standards — STR Management

## Stack

- **Next.js 16** (App Router, Turbopack in dev)
- **Tailwind CSS v4** — utility classes only, no custom CSS unless unavoidable
- **TypeScript** — strict mode, no `any`
- **Supabase** — browser client for client components, server client for server components and route handlers

## Directory Structure

```
src/
  app/              # Next.js App Router pages, layouts, and route handlers
  components/
    ui/             # Primitive, reusable UI components (Button, Input, etc.)
  lib/
    supabase/       # Supabase client factories (client.ts, server.ts, middleware.ts)
  hooks/            # Custom React hooks (client-side only — "use client")
  types/            # Shared TypeScript type definitions
```

## TypeScript

- Strict mode is enabled — no `any`, no `@ts-ignore` without a comment explaining why
- Prefer `interface` for object shapes that describe props or data models
- Prefer `type` for unions, intersections, and aliases
- Export types explicitly — do not rely on inferred return types for public APIs
- Use `unknown` instead of `any` for values of uncertain type; narrow before use

```ts
// Good
interface BookingProps {
  id: string;
  checkIn: Date;
  checkOut: Date;
}

// Bad
const booking: any = getBooking();
```

## Components

- **Functional components only** — no class components
- One component per file; file name matches the exported component name in PascalCase
- Props interfaces are defined in the same file, directly above the component
- Use named exports — no default exports for components

```tsx
// Good
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

// Bad
export default function Card(props: any) { ... }
```

## Hooks

- All hooks live in `src/hooks/` and must be client-side (`"use client"` directive)
- Hook files are named `useXxx.ts` (camelCase, `use` prefix)
- Each hook has a clear return type interface

## Supabase

- Use `createClient` from `@/lib/supabase/client` in client components
- Use `createClient` from `@/lib/supabase/server` in server components and route handlers
- Never expose the service role key on the client

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `BookingCard.tsx` |
| Hooks | camelCase with `use` prefix | `useBookings.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types/Interfaces | PascalCase | `BookingStatus` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_GUESTS` |
| Route segments | kebab-case | `app/booking-details/` |

## Don'ts

- Do not use `React.FC` — type props directly
- Do not commit `.env.local` — use `.env.local.example` as the template
- Do not add comments explaining *what* code does — only *why* when non-obvious
- Do not add `console.log` to committed code
- Do not create wrapper components or abstractions for single-use cases
