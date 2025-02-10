import React from 'react';
import { motion } from 'framer-motion';
import { mockPMs, mockEvents, mockClients } from '../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Title, Badge, Text } from '@tremor/react';
import { Event, ProjectManager } from '../types';

const Dashboard = () => {

  // Calculate conflicts
  const conflicts = mockEvents.reduce((acc, event) => {
    const key = `${event.user_id}-${event.start_time}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const conflictCount = Object.values(conflicts).filter(group => group.length > 1).length;

  // Calculate PM availability with more detailed metrics
  const pmAvailability = mockPMs.map(pm => {
    const pmEvents = mockEvents.filter(event => event.user_id === pm.id);
    const totalHours = 8; // Working hours (8 AM to 6 PM)
    const busyHours = pmEvents.reduce((acc, event) => {
      const duration = (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);

    // Calculate metrics
    const availableHours = totalHours - busyHours;
    const availabilityPercentage = (availableHours / totalHours * 100).toFixed(1);
    
    // Calculate call type breakdown
    const callTypes = pmEvents.reduce((acc, event) => {
      const type = event.call_type;
      acc[type] = (acc[type] || 0) + (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60 * 60);
      return acc;
    }, {} as Record<string, number>);

    return {
      id:pm.id,
      name: pm.name,
      totalHours,
      busyHours,
      availableHours,
      availabilityPercentage,
      callTypes
    };
  });

  // Add this new function to get in-progress calls
  const getInProgressCalls = () => {
    const now = new Date().getTime();
    return mockEvents
      .filter(event => {
        const startTime = new Date(event.start_time).getTime();
        const endTime = new Date(event.end_time).getTime();
        return now >= startTime && now <= endTime;
      })
      .map(event => {
        const pm = mockPMs.find(pm => pm.id === event.user_id);
        const client = mockClients.find(client => client.id === event.client_id);
        const endTime = new Date(event.end_time);
        const timeLeft = endTime.getTime() - new Date().getTime();
        const minutesLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60)));

        return {
          ...event,
          pmName: pm?.name || 'Unknown PM',
          clientName: client?.company_name || 'Unknown Client',
          minutesLeft
        };
      });
  };

  // Add this state for live updates
  const [inProgressCalls, setInProgressCalls] = React.useState(getInProgressCalls());

  // Update in-progress calls every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setInProgressCalls(getInProgressCalls());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {[
          { title: 'Total PMs', value: mockPMs.length, color: 'bg-blue-500' },
          { title: 'Total Calls', value: mockEvents.length, color: 'bg-green-500' },
          { title: 'Conflicts', value: conflictCount, color: 'bg-red-500' },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            variants={itemVariants}
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <Card className="overflow-hidden">
              <div className={`h-2 ${metric.color} mb-4`} />
              <div className="p-4">
                <h3 className="text-gray-500 text-sm font-medium">{metric.title}</h3>
                <p className="text-3xl font-bold mt-2">{metric.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Calls Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6"
      >
        <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Title>Active Calls</Title>
              <Badge size="sm" >
                {inProgressCalls.length} Active
              </Badge>
            </div>

            {inProgressCalls.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active calls at the moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressCalls.map((call) => (
                  <motion.div
                    key={call.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
                  >
                    {/* Pulsing Indicator */}
                    <div className="absolute top-4 right-4 flex items-center">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="ml-2 text-sm text-green-600 font-medium">Live</span>
                    </div>

                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">{call.pmName}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <span>{call.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                          <span>{call.clientName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-600">
                        Time Remaining
                      </div>
                      <div className="text-sm font-bold text-indigo-600">
                        {call.minutesLeft} minutes
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(call.minutesLeft / 60) * 100}%` }}
                        className="bg-indigo-600 h-2 rounded-full"
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* PM Availability Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <Title>Time Insights</Title>
          <Text className="text-gray-500 mt-1">Working hours: 9 AM - 5 PM</Text>

          <div className="mt-6 space-y-8">
            {pmAvailability.map((pm) => (
              <div key={pm.name} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pm.name}</h3>
                    <p className="text-sm text-gray-500">
                      {pm.availabilityPercentage}% available today
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {pm.availableHours.toFixed(1)} hrs free
                    </p>
                    <p className="text-sm text-gray-500">
                      of {pm.totalHours} hrs
                    </p>
                  </div>
                </div>

                {/* Time breakdown bars */}
                <div className="space-y-2">
                  {/* Main availability bar */}
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - Number(pm.availabilityPercentage)}%` }}
                      className="absolute left-0 top-0 h-full bg-blue-500"
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>

                  {/* Detailed breakdown */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Time in calls */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Time in calls</h4>
                      <div className="space-y-2">
                        {Object.entries(pm.callTypes).map(([type, hours]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">{type}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {hours.toFixed(1)} hrs
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time breakdown */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Time breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">In calls</span>
                          <span className="text-sm font-medium text-gray-900">
                            {pm.busyHours.toFixed(1)} hrs
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Available</span>
                          <span className="text-sm font-medium text-gray-900">
                            {pm.availableHours.toFixed(1)} hrs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time slots visualization */}
                <div className="grid grid-cols-10 gap-1 mt-4">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const hour = index + 8;
                    const hasCall = mockEvents.some(event => {
                      const eventHour = new Date(event.start_time).getHours();
                      return eventHour === hour && event.user_id === pm.id;
                    });
                    return (
                      <div
                        key={hour}
                        className={`h-2 rounded-full ${
                          hasCall ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                        title={`${hour}:00`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
     

      {/* Availability Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
        >
          <Title>Hourly Availability</Title>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Array.from({ length: 10 }, (_, i) => {
                  const hour = i + 8;
                  const busyPMs = mockEvents.filter(event => {
                    const eventHour = new Date(event.start_time).getHours();
                    return eventHour === hour;
                  }).length;
                  return {
                    hour: `${hour}:00`,
                    available: mockPMs.length - busyPMs,
                    busy: busyPMs
                  };
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="available" stackId="a" fill="#10B981" name="Available PMs" />
                <Bar dataKey="busy" stackId="a" fill="#EF4444" name="Busy PMs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
        >
          <Title>PM Workload Distribution</Title>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pmAvailability.map(pm => ({
                    name: pm.name,
                    value: pm.busyHours
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pmAvailability.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

     
    </motion.div>
  );
};

export default Dashboard; 