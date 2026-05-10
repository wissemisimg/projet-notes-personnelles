import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('Tous');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    // Filter by priority
    if (priorityFilter !== 'Tous') {
      result = result.filter(note => note.priority === priorityFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(note => 
        note.title.toLowerCase().includes(query) || 
        (note.content && note.content.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'priority-asc':
        const priorityOrder = { Basse: 1, Moyenne: 2, Haute: 3 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'priority-desc':
        const priorityOrderDesc = { Basse: 1, Moyenne: 2, Haute: 3 };
        result.sort((a, b) => priorityOrderDesc[b.priority] - priorityOrderDesc[a.priority]);
        break;
      default:
        break;
    }

    return result;
  }, [notes, priorityFilter, sortBy, searchQuery]);

  const handleCreate = async (noteData) => {
    try {
      const response = await api.post('/notes', noteData);
      setNotes([response.data, ...notes]);
      setShowForm(false);
      setMessage({ type: 'success', text: 'Note créée avec succès !' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la création' });
    }
  };

  const handleUpdate = async (noteData) => {
    try {
      const response = await api.put(`/notes/${editingNote.id}`, noteData);
      setNotes(notes.map(note => note.id === editingNote.id ? response.data : note));
      setEditingNote(null);
      setShowForm(false);
      setMessage({ type: 'success', text: 'Note mise à jour avec succès !' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.')) {
      return;
    }

    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
      setMessage({ type: 'success', text: 'Note supprimée avec succès !' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la suppression' });
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingNote(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const priorityCounts = {
    Tous: notes.length,
    Haute: notes.filter(n => n.priority === 'Haute').length,
    Moyenne: notes.filter(n => n.priority === 'Moyenne').length,
    Basse: notes.filter(n => n.priority === 'Basse').length,
  };

  const filters = [
    { value: 'Tous', color: 'bg-gray-500', count: priorityCounts.Tous },
    { value: 'Haute', color: 'bg-red-500', count: priorityCounts.Haute },
    { value: 'Moyenne', color: 'bg-orange-500', count: priorityCounts.Moyenne },
    { value: 'Basse', color: 'bg-green-500', count: priorityCounts.Basse },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Mes Notes</h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {notes.length} note{notes.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Toast Message */}
        {message && (
          <div className={`mb-6 px-5 py-4 rounded-2xl flex items-center gap-3 animate-slide-up ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {message.text}
          </div>
        )}

        {/* Search and Actions Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher une note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              >
                <option value="date-desc">Plus récent</option>
                <option value="date-asc">Plus ancien</option>
                <option value="title-asc">Titre A-Z</option>
                <option value="title-desc">Titre Z-A</option>
                <option value="priority-desc">Priorité ↓</option>
                <option value="priority-asc">Priorité ↑</option>
              </select>
              
              {/* Add Note Button */}
              {!showForm && !editingNote && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Nouvelle</span>
                </button>
              )}
            </div>
          </div>

          {/* Priority Filter Tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setPriorityFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  priorityFilter === filter.value
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {filter.value !== 'Tous' && (
                    <span className={`w-2 h-2 rounded-full ${filter.color}`}></span>
                  )}
                  {filter.value}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    priorityFilter === filter.value ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {filter.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Note Form */}
        {(showForm || editingNote) && (
          <div className="animate-slide-up">
            <NoteForm
              onSubmit={editingNote ? handleUpdate : handleCreate}
              editingNote={editingNote}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Results count */}
        {searchQuery && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredAndSortedNotes.length} résultat{filteredAndSortedNotes.length !== 1 ? 's' : ''} pour "{searchQuery}"
          </p>
        )}

        {/* Notes List */}
        <NoteList
          notes={filteredAndSortedNotes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default Notes;