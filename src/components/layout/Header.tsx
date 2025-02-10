import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const title = location.pathname === '/' ? 'Dashboard' : 'Calendar';

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
             MODOS
            </motion.h1>
          </div>
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm font-medium text-gray-500">{title}</span>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600">JS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}; 