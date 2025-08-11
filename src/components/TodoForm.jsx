/* EXPORTS: TodoForm */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useTodoContext } from '../context/TodoContext';

const TodoForm = () => {
  const { addTodo } = useTodoContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'high', label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
  ];

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newTodo = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addTodo(newTodo);

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal'
      });

      // Show success feedback (could be enhanced with toast)
      console.log('Todo added successfully');

    } catch (error) {
      console.error('Error adding todo:', error);
      setErrors({ submit: 'Failed to add todo. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || priorities[1].color;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Add New Todo</h2>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-200">
                Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter todo title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`backdrop-blur-sm bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-200 ${
                  errors.title ? 'border-red-400/50 focus:border-red-400/50' : ''
                }`}
                disabled={isSubmitting}
              />
              {errors.title && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </motion.div>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-200">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter todo description (optional)..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 rounded-md backdrop-blur-sm bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-400/50 focus:border-red-400/50' : ''
                }`}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </motion.div>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20 text-white focus:border-blue-400/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-gray-900/90 border-white/20">
                    {priorities.map((priority) => (
                      <SelectItem
                        key={priority.value}
                        value={priority.value}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={`${priority.color} text-xs`}>
                            {priority.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20 text-white focus:border-blue-400/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-gray-900/90 border-white/20">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Current Selection Preview */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-sm text-gray-300">Preview:</span>
              <Badge className={getPriorityColor(formData.priority)}>
                {priorities.find(p => p.value === formData.priority)?.label}
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                {categories.find(c => c.value === formData.category)?.label}
              </Badge>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.submit}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <motion.div
                className="flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding Todo...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Todo
                  </>
                )}
              </motion.div>
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { TodoForm };