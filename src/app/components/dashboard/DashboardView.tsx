'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { useHabitContext } from '../providers/HabitProvider';
import Card from '../common/Card';
import StatsCard from './StatsCard';
import WeeklyProgressChart from './WeeklyProgressChart';
import HabitOverview from './HabitOverview';
import HabitDetailModal from '../habits/HabitDetailModal';
import { getTimeOfDay, getMotivationalMessage } from '../utils/dateHelpers';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface DashboardViewProps {
    onChangeView: (view: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onChangeView }) => {
    const { darkMode } = useThemeContext();
    const {
        habits,
        user,
        stats,
        selectedHabit,
        setSelectedHabit,
        updateHabitProgress,
        getCompletionRate
    } = useHabitContext();

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleHabitUpdate = (habit: any) => {
        setSelectedHabit(habit);
        setIsDetailModalOpen(true);
    };

    const completedHabits = habits.filter(h => h.current >= h.target).length;

    return (
        <div className="space-y-6 pb-8">
            {/* Welcome Section */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Good {getTimeOfDay()}, {user?.name.split(' ')[0]}</h2>
                    <div className="text-sm px-3 py-1 bg-indigo-600 bg-opacity-10 text-indigo-600 rounded-full">
                        Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getMotivationalMessage(completedHabits)}
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                    <StatsCard
                        icon="🔥"
                        title="Current Streak"
                        value={`${user?.streak || 0} days`}
                        color="red"
                        className="flex-1 min-w-[150px]"
                    />

                    <StatsCard
                        icon="📈"
                        title="Completion Rate"
                        value={`${getCompletionRate()}%`}
                        color="blue"
                        className="flex-1 min-w-[150px]"
                    />

                    <StatsCard
                        icon="✅"
                        title="Total Habits"
                        value={habits.length}
                        color="green"
                        className="flex-1 min-w-[150px]"
                    />
                </div>
            </Card>

            {/* Weekly Progress Chart */}
            <Card className="p-6">
                <WeeklyProgressChart data={stats?.weeklyProgress || []} />
            </Card>

            {/* Habits Overview */}
            <Card className="p-6">
                <HabitOverview
                    habits={habits}
                    onViewAllClick={() => onChangeView('habits')}
                    onUpdateClick={handleHabitUpdate}
                />
            </Card>

            {/* Monthly Trend */}
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Monthly Completion Trend</h2>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={stats?.monthlyTrend || []}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                            />
                            <YAxis
                                tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                    borderColor: '#6366F1'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                name="Completion Rate (%)"
                                dataKey="value"
                                stroke="#6366F1"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Habit Detail Modal */}
            <HabitDetailModal
                habit={selectedHabit}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                onUpdate={(habit, value) => {
                    updateHabitProgress(habit, value);
                }}
            />
        </div>
    );
};

export default DashboardView;