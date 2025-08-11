/* EXPORTS: TodoApp as default */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Star, Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo.title.trim(),
      description: newTodo.description.trim(),
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos(prev => [todo, ...prev]);
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
    setIsAddDialogOpen(false);
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateTodo = (id, updates) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
    setEditingTodo(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'completed' && todo.completed) ||
      (filter === 'pending' && !todo.completed) ||
      (filter === 'high' && todo.priority === 'high');

    const matchesSearch = 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const TodoCard = ({ todo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate
    });

    const handleSave = () => {
      updateTodo(todo.id, editForm);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditForm({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate
      });
      setIsEditing(false);
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="group"
      >
        <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="border-white/30 data-[state=checked]:bg-white/20"
                />
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  ) : (
                    <h3 className={`font-semibold text-white ${todo.completed ? 'line-through opacity-60' : ''}`}>
                      {todo.title}
                    </h3>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Badge>
                {todo.priority === 'high' && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
              </div>
            </div>

            {todo.description && (
              <div className="ml-7">
                {isEditing ? (
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                ) : (
                  <p className={`text-white/80 text-sm ${todo.completed ? 'line-through opacity-60' : ''}`}>
                    {todo.description}
                  </p>
                )}
              </div>
            )}

            {todo.dueDate && (
              <div className="ml-7 flex items-center space-x-2 text-sm text-white/70">
                <Calendar className="w-4 h-4" />
                {isEditing ? (
                  <Input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="backdrop-blur-md bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between ml-7">
              {isEditing && (
                <Select value={editForm.priority} onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="w-32 backdrop-blur-md bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                {isEditing ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={handleSave} className="text-green-400 hover:bg-green-500/20">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel} className="text-red-400 hover:bg-red-500/20">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="text-blue-400 hover:bg-blue-500/20">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteTodo(todo.id)} className="text-red-400 hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
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
          <h1 className="text-4xl font-bold text-white mb-2">Glassmorphism Todo</h1>
          <p className="text-white/70">Organize your tasks with style</p>
        </motion.div>

        {/* Controls */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <Input
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40 backdrop-blur-md bg-white/10 border-white/20 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border-white/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Todo
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-md bg-black/80 border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Todo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Todo title..."
                    value={newTodo.title}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                    className="backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Textarea
                    placeholder="Description (optional)..."
                    value={newTodo.description}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                    className="backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <div className="flex gap-4">
                    <Select value={newTodo.priority} onValueChange={(value) => setNewTodo(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger className="backdrop-blur-md bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={newTodo.dueDate}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="backdrop-blur-md bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button onClick={addTodo} className="w-full backdrop-blur-md bg-white/20 hover:bg-white/30 text-white">
                    Add Todo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="backdrop-blur-md bg-white/10 border-white/20 p-4 text-center">
            <div className="text-2xl font-bold text-white">{todos.length}</div>
            <div className="text-white/70 text-sm">Total Tasks</div>
          </Card>
          <Card className="backdrop-blur-md bg-white/10 border-white/20 p-4 text-center">
            <div className="text-2xl font-bold text-white">{todos.filter(t => !t.completed).length}</div>
            <div className="text-white/70 text-sm">Pending</div>
          </Card>
          <Card className="backdrop-blur-md bg-white/10 border-white/20 p-4 text-center">
            <div className="text-2xl font-bold text-white">{todos.filter(t => t.completed).length}</div>
            <div className="text-white/70 text-sm">Completed</div>
          </Card>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <Card className="backdrop-blur-md bg-white/10 border-white/20 p-8 text-center">
              <p className="text-white/70 text-lg">
                {todos.length === 0 ? 'No todos yet. Create your first task!' : 'No todos match your current filter.'}
              </p>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredTodos.map(todo => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;