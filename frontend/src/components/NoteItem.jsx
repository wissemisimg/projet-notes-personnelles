import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NoteItem = ({ note, onEdit, onDelete }) => {
  const priorityConfig = {
    Basse: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
      border: 'border-green-200',
    },
    Moyenne: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
      border: 'border-orange-200',
    },
    Haute: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      border: 'border-red-200',
    },
  };

  const config = priorityConfig[note.priority];

  const formatDate = (date) => {
    return format(new Date(date), 'd MMMM yyyy', { locale: fr });
  };

  const timeAgo = (date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffInHours = Math.floor((now - noteDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return formatDate(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 mb-4 transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">{note.title}</h3>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} flex-shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
          {note.priority}
        </span>
      </div>

      {note.content && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {note.content}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span title={formatDate(note.created_at)}>{timeAgo(note.created_at)}</span>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(note)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;