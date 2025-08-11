/* EXPORTS: App as default */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, CheckCircle2, Circle, Edit3, Trash2, Star, Clock, AlertCircle } from 'lucide-react';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString()
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const setPriority = (id, priority) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && !todo.completed) ||
                         (filter === 'completed' && todo.completed);
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'low': return <Star className="w-4 h-4 text-green-400" />;
      default: return null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Glassmorphism Todo
          </h1>
          <p className="text-blue-200 text-lg">Organize your tasks with style</p>
        </motion.div>

        {/* Main Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6 md:p-8"
        >
          {/* Add Todo Section */}
          <div className="mb-8">
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new task..."
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTodo}
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </motion.button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'active', 'completed'].map((filterType) => (
                  <motion.button
                    key={filterType}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${
                      filter === filterType
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-blue-200 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Filter className="w-4 h-4 inline mr-2" />
                    {filterType}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleComplete(todo.id)}
                      className="flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-blue-300 hover:text-blue-400" />
                      )}
                    </motion.button>

                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={handleEditKeyPress}
                          onBlur={saveEdit}
                          autoFocus
                          className="w-full bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded px-2 py-1"
                        />
                      ) : (
                        <span
                          className={`text-lg ${
                            todo.completed
                              ? 'text-gray-400 line-through'
                              : 'text-white'
                          }`}
                        >
                          {todo.text}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Priority Selector */}
                      <div className="flex gap-1">
                        {['low', 'medium', 'high'].map((priority) => (
                          <motion.button
                            key={priority}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPriority(todo.id, priority)}
                            className={`p-1 rounded ${
                              todo.priority === priority
                                ? 'bg-white/20'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            title={`${priority} priority`}
                          >
                            {getPriorityIcon(priority)}
                          </motion.button>
                        ))}
                      </div>

                      {/* Edit Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startEdit(todo)}
                        className="p-2 text-blue-300 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>

                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-red-300 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTodos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-blue-200 text-lg mb-2">
                  {todos.length === 0 ? 'No tasks yet' : 'No tasks match your filter'}
                </div>
                <div className="text-blue-300 text-sm">
                  {todos.length === 0 ? 'Add your first task to get started!' : 'Try adjusting your search or filter'}
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats */}
          {todos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <div className="flex justify-center gap-8 text-sm text-blue-200">
                <div>
                  <span className="font-semibold text-white">{todos.length}</span> total
                </div>
                <div>
                  <span className="font-semibold text-green-400">{todos.filter(t => t.completed).length}</span> completed
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">{todos.filter(t => !t.completed).length}</span> active
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export { App as default };