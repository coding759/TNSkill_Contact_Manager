export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ContactInput = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
