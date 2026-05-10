import { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, editingNote, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Moyenne');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content || '');
      setPriority(editingNote.priority);
    } else {
      setTitle('');
      setContent('');
      setPriority('Moyenne');
    }
    setError('');
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    if (title.length > 100) {
      setError('Le titre ne doit pas dépasser 100 caractères');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      priority,
    });

    if (!editingNote) {
      setTitle('');
      setContent('');
      setPriority('Moyenne');
    }
  };

  const priorityOptions = [
    { value: 'Basse', color: 'bg-green-500', label: 'Basse' },
    { value: 'Moyenne', color: 'bg-orange-500', label: 'Moyenne' },
    { value: 'Haute', color: 'bg-red-500', label: 'Haute' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-8 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${editingNote ? 'bg-amber-100' : 'bg-primary-100'}`}>
          {editingNote ? (
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {editingNote ? 'Modifier la note' : 'Nouvelle note'}
        </h3>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Titre de votre note..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <p className="mt-1 text-xs text-gray-400">{title.length}/100 caractères</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contenu</label>
          <textarea
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
            rows="4"
            placeholder="Écrivez le contenu de votre note (optionnel)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Priorité</label>
          <div className="flex gap-3">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  priority === option.value
                    ? `${option.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 ${
              editingNote
                ? 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-200'
                : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-200'
            }`}
          >
            {editingNote ? 'Mettre à jour' : 'Ajouter la note'}
          </button>
          {editingNote && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NoteForm;