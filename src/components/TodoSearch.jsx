/* EXPORTS: TodoSearch as default */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const TodoSearch = ({ onSearch, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-md mx-auto mb-6"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Glassmorphism container */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg group-hover:bg-white/15 transition-all duration-300" />
          
          {/* Search input */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 z-10" />
            
            <Input
              type="text"
              placeholder="Search todos..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="
                w-full pl-10 pr-12 py-3 
                bg-transparent border-none 
                text-white placeholder:text-white/50
                focus:outline-none focus:ring-0
                relative z-10
              "
            />
            
            {/* Clear button */}
            {localSearchTerm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="
                    h-8 w-8 p-0 
                    text-white/60 hover:text-white 
                    hover:bg-white/10 
                    rounded-full
                    transition-all duration-200
                  "
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </form>

      {/* Search results indicator */}
      {localSearchTerm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <span className="text-xs text-white/60 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
            Searching for "{localSearchTerm}"
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export { TodoSearch as default };