# Basira v2 — System Rebuild Guide

## Reference Codebase
The legacy codebase is located at: `../Beneficiary-System-Clean-Backup/`
Use it as a **read-only reference** to understand business logic, data models,
field names, validation rules, user workflows, and domain terminology.
Never replicate its patterns, architecture, or code style.

## Project Identity
- **Name**: نظام بصيرة (Basira System)
- **Purpose**: Comprehensive care facility management system for HRSD (Human Resources and Social Development)
- **Language**: Arabic-first UI (RTL), code in English
- **Brand Colors**: Navy #14415A, Teal #1E6B5C, Gold #F59601, Light Gray #F8F9FA

## Tech Stack
- React 19 + Vite + TypeScript (strict)
- Tailwind CSS v4 (CSS-first config)
- Supabase (same database as v1 — project `ruesovrbhcjphmfdcpsa`)
- TanStack Query v5 (server state)
- Zustand v5 (client state)
- React Hook Form + Zod (forms & validation)
- React Router v7 (routing, lazy loading)
- Framer Motion (animations)
- Recharts (charts)
- Lucide React (icons)

## Architecture Rules
- **Feature-based structure**: `src/features/<name>/` with api/, components/, hooks/, types.ts, pages/
- **No `any` types** — use `unknown` and narrow
- **No `@ts-ignore`** — fix the actual type issue
- **Path alias**: `@/` maps to `src/`
- **Server state**: Always TanStack Query (never useState for API data)
- **Client state**: Zustand stores in `src/stores/`
- **Form pattern**: react-hook-form + zodResolver + Zod schema
- **Lazy loading**: All route pages must be `React.lazy()` wrapped
- **RTL-first**: `dir="rtl"` on html element, Arabic is the default language
- **Dark mode default**: Class-based toggle with `.dark` on body

## Core Principles
- You have full creative freedom in implementation details, component design, and UX patterns
- Prioritize developer experience, code clarity, and performance
- Every feature should be self-contained and independently testable
- The app should feel fast, modern, and professional
- Same business logic and data as v1 — better UX and code quality

## Quality Standards
- `tsc --noEmit` must pass with zero errors
- Every form uses Zod validation
- Every page handles: Loading, Error, Empty, Success states
- Responsive design (mobile, tablet, desktop)
- RTL correct from the start
- Lazy loading for all route pages
