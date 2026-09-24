# Contact Manager

A lightweight React + TypeScript contact management app built with Vite and Supabase. It lets you add, search, edit, and delete contacts in a simple address-book interface.

## Features

- Search contacts by name, email, phone, company, or notes
- Add new contacts
- Edit existing contacts
- Delete contacts with confirmation
- Responsive layout for desktop and mobile
- Supabase-powered persistence

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Lucide React

## Project Structure

```text
src/
  App.tsx
  components/
    ConfirmDialog.tsx
    ContactCard.tsx
    ContactForm.tsx
  lib/
    supabase.ts
  types/
    contact.ts
supabase/
  migrations/
    20260924161659_create_contacts_table.sql
```

## Prerequisites

- Node.js 18+
- npm
- A Supabase project

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the database migration in Supabase or apply the SQL in `supabase/migrations/20260924161659_create_contacts_table.sql`.

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
typecheck
```

## Notes

This app uses a shared, public contact table with row-level security enabled. The schema is designed for a simple single-tenant contact workspace without user authentication.

## License

This project is for demo and learning purposes.
