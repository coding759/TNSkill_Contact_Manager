/*
# Create contacts table for the cloud contact manager

1. New Tables
- `contacts`
- `id` (uuid, primary key): Stable identifier for each contact.
- `name` (text): Required display name.
- `email` (text): Optional email address.
- `phone` (text): Optional phone number.
- `company` (text): Optional company or organization.
- `notes` (text): Optional private context for the contact.
- `created_at` (timestamptz): Time the contact was created.
- `updated_at` (timestamptz): Time the contact was last changed.

2. Security
- Row level security is enabled.
- Because this app has no sign-in screen, anon and authenticated roles receive intentionally shared CRUD access for the single-tenant contact list.

3. Important Notes
- The table is designed for the app's shared contact workspace and does not attach rows to a user account.
- The `updated_at` value is maintained by the application when an existing contact is edited.
*/

CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shared_contacts_select" ON public.contacts;
CREATE POLICY "shared_contacts_select" ON public.contacts
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_contacts_insert" ON public.contacts;
CREATE POLICY "shared_contacts_insert" ON public.contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "shared_contacts_update" ON public.contacts;
CREATE POLICY "shared_contacts_update" ON public.contacts
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "shared_contacts_delete" ON public.contacts;
CREATE POLICY "shared_contacts_delete" ON public.contacts
  FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS contacts_name_idx ON public.contacts (lower(name));
CREATE INDEX IF NOT EXISTS contacts_email_idx ON public.contacts (lower(email));