/* EXPORTS: TodoHeader */

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const TodoHeader = ({ todos = [] }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const highPriorityTodos = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const stats = [
    {
      label: 'Total',
      value: totalTodos,
      icon: Circle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Completed',
      value: completedTodos,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Pending',
      value: pendingTodos,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'High Priority',
      value: highPriorityTodos,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-8"
    >
      <Card className="glass-card border-0 shadow-xl backdrop-blur-xl bg-white/10">
        <div className="p-6 sm:p-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight"
            >
              Todo Manager
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/70 text-lg"
            >
              Stay organized with glassmorphism design
            </motion.p>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 font-medium">Overall Progress</span>
              <Badge 
                variant="secondary" 
                className="bg-white/20 text-white border-white/30"
              >
                {completionPercentage}%
              </Badge>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg"
              />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="glass-card bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                      className="text-2xl font-bold text-white"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-white/60 text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Motivational Message */}
          {totalTodos > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-white/70 text-sm">
                {completionPercentage === 100 
                  ? "🎉 Amazing! All tasks completed!" 
                  : completionPercentage >= 75 
                  ? "💪 Great progress! Keep it up!" 
                  : completionPercentage >= 50 
                  ? "📈 You're halfway there!" 
                  : "🚀 Let's get started on your goals!"
                }
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export { TodoHeader };