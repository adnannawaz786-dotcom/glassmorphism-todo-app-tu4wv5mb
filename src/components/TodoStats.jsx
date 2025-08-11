/* EXPORTS: TodoStats */

import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const TodoStats = ({ todos }) => {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: totalTasks,
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      id: 'pending',
      label: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      id: 'priority',
      label: 'High Priority',
      value: highPriorityTasks,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Progress Bar */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
                Overall Progress
              </h3>
              <span className="text-2xl font-bold text-white">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-white/70 mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          
          return (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`backdrop-blur-md bg-white/5 border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300 ${stat.borderColor}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 truncate">
                        {stat.label}
                      </p>
                      <motion.p 
                        className="text-2xl font-bold text-white"
                        key={stat.value}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Insights */}
      {totalTasks > 0 && (
        <motion.div
          className="mt-6"
          variants={itemVariants}
        >
          <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  {completionRate === 100 ? 'All tasks completed! 🎉' :
                   completionRate >= 75 ? 'Great progress! Keep going!' :
                   completionRate >= 50 ? 'You\'re halfway there!' :
                   completionRate >= 25 ? 'Good start! Keep it up!' :
                   'Let\'s get started!'}
                </span>
                {highPriorityTasks > 0 && (
                  <span className="text-red-400 font-medium">
                    {highPriorityTasks} high priority pending
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export { TodoStats };