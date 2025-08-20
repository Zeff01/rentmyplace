import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const EmptyState = ({ message, icon: Icon = Home }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className="h-16 w-16 text-muted-foreground/50 mb-4" />
      </motion.div>
      <p className="text-xl text-muted-foreground">{message}</p>
    </motion.div>
  );
};

export default EmptyState;