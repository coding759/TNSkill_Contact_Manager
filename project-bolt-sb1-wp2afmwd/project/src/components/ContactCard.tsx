import { Mail, Phone, Building2, Pencil, Trash2 } from 'lucide-react';
import type { Contact } from '@/types/contact';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function hueFor(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
  }
  return Math.abs(hash) % 360;
}

export default function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const hue = hueFor(contact.name);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-white text-sm shadow-sm"
          style={{ backgroundColor: `hsl(${hue}, 65%, 52%)` }}
        >
          {initials(contact.name) || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{contact.name}</h3>
          {contact.company && (
            <p className="text-sm text-slate-500 truncate mt-0.5">{contact.company}</p>
          )}

          <div className="mt-3 space-y-1.5">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition truncate"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                <span className="truncate">{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition truncate"
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                <span className="truncate">{contact.phone}</span>
              </a>
            )}
          </div>

          {contact.notes && (
            <p className="mt-3 text-sm text-slate-500 line-clamp-2 bg-slate-50 rounded-lg px-3 py-2">
              {contact.notes}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
          aria-label="Edit contact"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          aria-label="Delete contact"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
