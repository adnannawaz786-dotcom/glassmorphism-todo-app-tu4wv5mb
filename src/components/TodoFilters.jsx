/* EXPORTS: TodoFilters */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { All, CheckCircle2, Circle, Clock } from 'lucide-react';

const TodoFilters = ({ 
  currentFilter, 
  onFilterChange, 
  todos = [],
  className = '' 
}) => {
  const filters = [
    {
      id: 'all',
      label: 'All',
      icon: All,
      count: todos.length,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'active',
      label: 'Active',
      icon: Circle,
      count: todos.filter(todo => !todo.completed).length,
      color: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: todos.filter(todo => todo.completed).length,
      color: 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    inactive: { 
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    },
    active: { 
      scale: 1.05,
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
    },
    hover: { 
      scale: 1.02,
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  };

  return (
    <motion.div
      className={`flex flex-wrap gap-2 sm:gap-3 p-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        const isActive = currentFilter === filter.id;
        
        return (
          <motion.div
            key={filter.id}
            variants={itemVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className={`
                relative overflow-hidden backdrop-blur-md border
                ${isActive 
                  ? 'bg-white/20 border-white/30 text-white shadow-lg' 
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }
                transition-all duration-300 ease-in-out
                flex items-center gap-2 px-3 py-2
                group
              `}
              asChild
            >
              <motion.button
                variants={buttonVariants}
                animate={isActive ? "active" : "inactive"}
                whileHover="hover"
              >
                {/* Glass morphism background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <IconComponent className="h-4 w-4" />
                
                <span className="font-medium">
                  {filter.label}
                </span>
                
                <Badge 
                  variant="secondary"
                  className={`
                    ml-1 px-2 py-0.5 text-xs font-bold
                    backdrop-blur-sm border
                    ${filter.color}
                    transition-all duration-300
                  `}
                >
                  {filter.count}
                </Badge>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50"
                    layoutId="activeFilter"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            </Button>
          </motion.div>
        );
      })}
      
      {/* Priority filter indicator */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-1 px-3 py-2 rounded-md bg-white/5 backdrop-blur-md border border-white/10"
      >
        <Clock className="h-3 w-3 text-white/60" />
        <span className="text-xs text-white/60">
          {todos.filter(todo => todo.priority === 'high').length} High Priority
        </span>
      </motion.div>
    </motion.div>
  );
};

export { TodoFilters };