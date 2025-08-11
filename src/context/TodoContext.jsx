/* EXPORTS: TodoProvider, useTodos */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TodoContext = createContext();

const initialState = {
  todos: [],
  filter: 'all', // all, active, completed
  sortBy: 'created', // created, priority, alphabetical
  isLoading: false,
  error: null
};

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOAD_TODOS':
      return { ...state, todos: action.payload, isLoading: false, error: null };
    
    case 'ADD_TODO':
      const newTodo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority || 'medium',
        category: action.payload.category || 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedTodosAdd = [...state.todos, newTodo];
      localStorage.setItem('glassmorphism-todos', JSON.stringify(updatedTodosAdd));
      return { ...state, todos: updatedTodosAdd };
    
    case 'UPDATE_TODO':
      const updatedTodosUpdate = state.todos.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : todo
      );
      localStorage.setItem('glassmorphism-todos', JSON.stringify(updatedTodosUpdate));
      return { ...state, todos: updatedTodosUpdate };
    
    case 'DELETE_TODO':
      const updatedTodosDelete = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem('glassmorphism-todos', JSON.stringify(updatedTodosDelete));
      return { ...state, todos: updatedTodosDelete };
    
    case 'TOGGLE_TODO':
      const updatedTodosToggle = state.todos.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      );
      localStorage.setItem('glassmorphism-todos', JSON.stringify(updatedTodosToggle));
      return { ...state, todos: updatedTodosToggle };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    
    case 'CLEAR_COMPLETED':
      const activeTodos = state.todos.filter(todo => !todo.completed);
      localStorage.setItem('glassmorphism-todos', JSON.stringify(activeTodos));
      return { ...state, todos: activeTodos };
    
    case 'REORDER_TODOS':
      localStorage.setItem('glassmorphism-todos', JSON.stringify(action.payload));
      return { ...state, todos: action.payload };
    
    default:
      return state;
  }
};

const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadTodos = () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const savedTodos = localStorage.getItem('glassmorphism-todos');
        const todos = savedTodos ? JSON.parse(savedTodos) : [];
        dispatch({ type: 'LOAD_TODOS', payload: todos });
      } catch (error) {
        console.error('Error loading todos:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load todos' });
      }
    };

    loadTodos();
  }, []);

  // Action creators
  const addTodo = (text, priority = 'medium', category = 'general') => {
    if (!text.trim()) return;
    dispatch({
      type: 'ADD_TODO',
      payload: { text: text.trim(), priority, category }
    });
  };

  const updateTodo = (id, updates) => {
    dispatch({
      type: 'UPDATE_TODO',
      payload: { id, updates }
    });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const reorderTodos = (newOrder) => {
    dispatch({ type: 'REORDER_TODOS', payload: newOrder });
  };

  // Computed values
  const getFilteredTodos = () => {
    let filtered = state.todos;

    // Apply filter
    switch (state.filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (state.sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'created':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  const getStats = () => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, completionRate };
  };

  const getCategoryCounts = () => {
    const counts = {};
    state.todos.forEach(todo => {
      counts[todo.category] = (counts[todo.category] || 0) + 1;
    });
    return counts;
  };

  const value = {
    // State
    todos: state.todos,
    filter: state.filter,
    sortBy: state.sortBy,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    setSortBy,
    clearCompleted,
    reorderTodos,
    
    // Computed
    filteredTodos: getFilteredTodos(),
    stats: getStats(),
    categoryCounts: getCategoryCounts()
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export { TodoProvider, useTodos };