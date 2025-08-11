/* EXPORTS: TodoList as default */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Trash2, Edit3, GripVertical, Clock, AlertCircle, CheckCircle2, X, Check } from 'lucide-react';
import { useTodo } from '../context/TodoContext';

const TodoList = () => {
  const { todos, updateTodo, deleteTodo, reorderTodos } = useTodo();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      reorderTodos(sourceIndex, destinationIndex);
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateTodo(editingId, { text: editText.trim() });
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const toggleComplete = (todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-3 h-3" />;
      case 'medium':
        return <Clock className="w-3 h-3" />;
      case 'low':
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-white/80 mb-2">No todos yet</h3>
        <p className="text-white/60">Add your first todo to get started!</p>
      </motion.div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-3 transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-white/5 rounded-lg p-2' : ''
            }`}
          >
            <AnimatePresence>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`transform transition-all duration-200 ${
                        snapshot.isDragging ? 'rotate-2 scale-105' : ''
                      }`}
                    >
                      <Card className="group backdrop-blur-xl bg-white/10 border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="mt-1 p-1 hover:bg-white/10 rounded cursor-grab active:cursor-grabbing transition-colors"
                            >
                              <GripVertical className="w-4 h-4 text-white/50" />
                            </div>

                            {/* Checkbox */}
                            <Checkbox
                              checked={todo.completed}
                              onCheckedChange={() => toggleComplete(todo)}
                              className="mt-1 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />

                            {/* Todo Content */}
                            <div className="flex-1 min-w-0">
                              {editingId === todo.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveEdit();
                                      if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleSaveEdit}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCancelEdit}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div>
                                  <p
                                    className={`text-white transition-all duration-200 ${
                                      todo.completed
                                        ? 'line-through opacity-60'
                                        : 'opacity-90'
                                    }`}
                                  >
                                    {todo.text}
                                  </p>

                                  {/* Tags and Priority */}
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {/* Priority Badge */}
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getPriorityColor(todo.priority)} backdrop-blur-sm`}
                                    >
                                      {getPriorityIcon(todo.priority)}
                                      <span className="ml-1 capitalize">{todo.priority}</span>
                                    </Badge>

                                    {/* Due Date */}
                                    {todo.dueDate && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm"
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDate(todo.dueDate)}
                                      </Badge>
                                    )}

                                    {/* Category */}
                                    {todo.category && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-sm"
                                      >
                                        {todo.category}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            {editingId !== todo.id && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(todo)}
                                  className="text-white/60 hover:text-white hover:bg-white/10"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTodo(todo.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export { TodoList as default };