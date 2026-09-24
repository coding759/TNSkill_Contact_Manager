import { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, Plus, Search, Contact as ContactIcon, Loader2, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Contact, ContactInput } from '@/types/contact';
import ContactCard from '@/components/ContactCard';
import ContactForm from '@/components/ContactForm';
import ConfirmDialog from '@/components/ConfirmDialog';

type Status = 'loading' | 'ready' | 'error';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadContacts = useCallback(async () => {
    setStatus('loading');
    setLoadError(null);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      setStatus('error');
      setLoadError(error.message);
    } else {
      setContacts((data as Contact[]) ?? []);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      [c.name, c.email, c.phone, c.company, c.notes]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [contacts, search]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setEditing(contact);
    setFormOpen(true);
  };

  const handleSave = async (input: ContactInput, id?: string) => {
    if (id) {
      const { data, error } = await supabase
        .from('contacts')
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? (data as Contact) : c)),
      );
    } else {
      const { data, error } = await supabase
        .from('contacts')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      setContacts((prev) => {
        const next = [...prev, data as Contact];
        next.sort((a, b) => a.name.localeCompare(b.name));
        return next;
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('contacts').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      setLoadError(error.message);
      setStatus('error');
      return;
    }
    setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const total = contacts.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-sm shadow-sky-600/30">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-lg leading-tight truncate">Contacts</h1>
            <p className="text-xs text-slate-500">
              {total} {total === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium text-sm hover:bg-sky-700 active:scale-95 transition shadow-sm shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Contact</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, company…"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition"
          />
        </div>

        {/* States */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-sky-500" />
            <p className="mt-3 text-sm">Loading your contacts…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-slate-700 font-medium">Couldn't load contacts</p>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              {loadError ?? 'Something went wrong.'}
            </p>
            <button
              onClick={loadContacts}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && (
          <>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-5">
                  <ContactIcon className="w-8 h-8 text-sky-500" />
                </div>
                {search ? (
                  <>
                    <p className="text-slate-700 font-medium">No matches found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      No contacts match “{search}”.
                    </p>
                    <button
                      onClick={() => setSearch('')}
                      className="mt-4 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-slate-700 font-medium">No contacts yet</p>
                    <p className="mt-1 text-sm text-slate-500 max-w-sm">
                      Add your first contact to start building your address book.
                    </p>
                    <button
                      onClick={openNew}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition shadow-sm shadow-sky-600/20"
                    >
                      <Plus className="w-4 h-4" />
                      Add Contact
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onEdit={() => openEdit(contact)}
                    onDelete={() => setDeleteTarget(contact)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <ContactForm
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete contact?"
        message={`“${deleteTarget?.name ?? ''}” will be permanently removed.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
