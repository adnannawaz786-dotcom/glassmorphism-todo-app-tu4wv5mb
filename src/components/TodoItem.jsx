/* EXPORTS: TodoItem */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit2, Trash2, Calendar, Flag, X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const TodoItem = ({ todo, onUpdate, onDelete, onToggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority || 'medium',
    dueDate: todo.dueDate || ''
  });

  const priorityColors = {
    low: 'bg-green-500/20 text-green-300 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  const priorityIcons = {
    low: <Flag className="w-3 h-3" />,
    medium: <Flag className="w-3 h-3" />,
    high: <Flag className="w-3 h-3" />
  };

  const handleSave = () => {
    if (editedTodo.title.trim()) {
      onUpdate(todo.id, editedTodo);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTodo({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority || 'medium',
      dueDate: todo.dueDate || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = () => {
    if (!todo.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return dueDate < today && !todo.completed;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`
        group relative backdrop-blur-xl bg-white/10 border border-white/20 
        rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300
        hover:bg-white/15 hover:border-white/30
        ${todo.completed ? 'opacity-60' : ''}
        ${isOverdue() ? 'ring-2 ring-red-500/50' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Complete Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleComplete(todo.id)}
          className={`
            mt-1 p-1 h-6 w-6 rounded-full border-2 transition-all duration-300
            ${todo.completed 
              ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' 
              : 'border-white/40 hover:border-white/60 hover:bg-white/10'
            }
          `}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </Button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              {/* Edit Title */}
              <Input
                value={editedTodo.title}
                onChange={(e) => setEditedTodo(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="Todo title..."
              />

              {/* Edit Description */}
              <Textarea
                value={editedTodo.description}
                onChange={(e) => setEditedTodo(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
                placeholder="Description (optional)..."
                rows={2}
              />

              {/* Edit Priority and Due Date */}
              <div className="flex gap-2">
                <Select
                  value={editedTodo.priority}
                  onValueChange={(value) => setEditedTodo(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={editedTodo.dueDate}
                  onChange={(e) => setEditedTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="flex-1 bg-white/10 border-white/20 text-white"
                />
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Title */}
              <h3 className={`
                text-lg font-medium text-white transition-all duration-300
                ${todo.completed ? 'line-through opacity-60' : ''}
              `}>
                {todo.title}
              </h3>

              {/* Description */}
              {todo.description && (
                <p className="text-sm text-white/70 leading-relaxed">
                  {todo.description}
                </p>
              )}

              {/* Priority and Due Date */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs ${priorityColors[todo.priority]} backdrop-blur-sm`}
                >
                  {priorityIcons[todo.priority]}
                  <span className="ml-1 capitalize">{todo.priority}</span>
                </Badge>

                {todo.dueDate && (
                  <Badge
                    variant="outline"
                    className={`
                      text-xs backdrop-blur-sm
                      ${isOverdue() 
                        ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }
                    `}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(todo.dueDate)}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="p-2 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(todo.id)}
              className="p-2 h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Glassmorphism Shine Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export { TodoItem };