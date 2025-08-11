/* EXPORTS: useTodos */

import { useState, useEffect, useCallback } from 'react';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('glassmorphism-todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      }
    } catch (err) {
      setError('Failed to load todos from storage');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
      } catch (err) {
        setError('Failed to save todos to storage');
        console.error('Error saving todos:', err);
      }
    }
  }, [todos, loading]);

  // Add new todo
  const addTodo = useCallback((text, priority = 'medium') => {
    if (!text.trim()) {
      setError('Todo text cannot be empty');
      return false;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
    setError(null);
    return true;
  }, []);

  // Update todo
  const updateTodo = useCallback((id, updates) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      )
    );
    setError(null);
  }, []);

  // Toggle todo completion
  const toggleTodo = useCallback((id) => {
    updateTodo(id, { completed: !todos.find(todo => todo.id === id)?.completed });
  }, [todos, updateTodo]);

  // Delete todo
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    setError(null);
  }, []);

  // Delete all completed todos
  const deleteCompletedTodos = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    setError(null);
  }, []);

  // Mark all todos as completed
  const markAllCompleted = useCallback(() => {
    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: true,
        updatedAt: new Date().toISOString()
      }))
    );
    setError(null);
  }, []);

  // Clear all todos
  const clearAllTodos = useCallback(() => {
    setTodos([]);
    setError(null);
  }, []);

  // Reorder todos (for drag and drop)
  const reorderTodos = useCallback((startIndex, endIndex) => {
    setTodos(prevTodos => {
      const result = Array.from(prevTodos);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  // Get filtered todos based on current filter and search term
  const getFilteredTodos = useCallback(() => {
    let filtered = todos;

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'high':
        filtered = filtered.filter(todo => todo.priority === 'high');
        break;
      case 'medium':
        filtered = filtered.filter(todo => todo.priority === 'medium');
        break;
      case 'low':
        filtered = filtered.filter(todo => todo.priority === 'low');
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by priority and creation date
    return filtered.sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [todos, filter, searchTerm]);

  // Get todo statistics
  const getStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

    return {
      total,
      completed,
      active,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [todos]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    todos: getFilteredTodos(),
    allTodos: todos,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    stats: getStats(),
    actions: {
      addTodo,
      updateTodo,
      toggleTodo,
      deleteTodo,
      deleteCompletedTodos,
      markAllCompleted,
      clearAllTodos,
      reorderTodos,
      clearError
    }
  };
};

export { useTodos };