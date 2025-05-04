'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { useHabitContext } from '../providers/HabitProvider';
import Card from '../common/Card';
import Button from '../common/Button';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';
import HabitDetailModal from './HabitDetailModal';

const HabitsView: React.FC = () => {
    const { darkMode } = useThemeContext();
    const {
        habits,
        addHabit,
        deleteHabit,
        updateHabitProgress,
        selectedHabit,
        setSelectedHabit
    } = useHabitContext();

    const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleOpenHabitDetail = (habitId: string) => {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            setSelectedHabit(habit);
            setIsDetailModalOpen(true);
        }
    };

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
            opacity: 1
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <Card className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Habits</h2>
                    <Button
                        variant="primary"
                        leftIcon={<span>➕</span>}
                        onClick={() => setIsAddHabitOpen(true)}
                    >
                        Add Habit
                    </Button>
                </div>

                {habits.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {habits.map(habit => (
                            <motion.div key={habit.id} variants={itemVariants}>
                                <HabitCard
                                    habit={habit}
                                    onUpdate={() => handleOpenHabitDetail(habit.id)}
                                    onDelete={() => deleteHabit(habit.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't added any habits yet</p>
                        <Button
                            variant="primary"
                            onClick={() => setIsAddHabitOpen(true)}
                        >
                            Get Started
                        </Button>
                    </div>
                )}
            </Card>

            {/* Add Habit Modal */}
            <AddHabitModal
                isOpen={isAddHabitOpen}
                onClose={() => setIsAddHabitOpen(false)}
                onAdd={(habitData) => {
                    addHabit(habitData);
                    setIsAddHabitOpen(false);
                }}
            />

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

export default HabitsView;