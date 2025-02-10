import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    // { path: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    // { path: '/team', label: 'Team', icon: UsersIcon },
    { path: '/settings', label: 'Settings', icon: CogIcon },
  ];

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white border-r border-gray-100 min-h-screen p-4 fixed left-0 top-16"
    >
      <nav className="space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute right-0 w-1 h-8 bg-indigo-600 rounded-l-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

    </motion.aside>
  );
}; 