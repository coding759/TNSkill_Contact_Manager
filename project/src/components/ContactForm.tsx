import { useEffect, useState } from 'react';
import { X, User, Mail, Phone, Building2, StickyNote } from 'lucide-react';
import type { Contact, ContactInput } from '@/types/contact';

interface ContactFormProps {
  open: boolean;
  initial?: Contact | null;
  onClose: () => void;
  onSave: (input: ContactInput, id?: string) => Promise<void>;
}

type FormState = Record<keyof ContactInput, string>;

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
};

export default function ContactForm({ open, initial, onClose, onSave }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (initial) {
        setForm({
          name: initial.name,
          email: initial.email ?? '',
          phone: initial.phone ?? '',
          company: initial.company ?? '',
          notes: initial.notes ?? '',
        });
      } else {
        setForm(empty);
      }
    }
  }, [open, initial]);

  if (!open) return null;

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(
        {
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
          notes: form.notes.trim() || null,
        },
        initial?.id,
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof FormState; label: string; icon: typeof Mail; placeholder: string; type: string }[] = [
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'name@example.com', type: 'email' },
    { key: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 (555) 000-0000', type: 'tel' },
    { key: 'company', label: 'Company', icon: Building2, placeholder: 'Company name', type: 'text' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-5 border-b border-slate-100 rounded-t-3xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <User className="w-5 h-5 text-sky-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {initial ? 'Edit Contact' : 'New Contact'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition"
            />
          </div>

          {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={type}
                  value={form[key] as string}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Add a note about this contact..."
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm shadow-sky-600/20"
            >
              {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
