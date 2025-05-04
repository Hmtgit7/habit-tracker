'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import Button from '../common/Button';
import { getRandomHabitIcon } from '../utils/habitHelpers';

interface AddHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (habitData: {
        name: string;
        target: number;
        unit: string;
        color: string;
        icon?: string;
    }) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({
    isOpen,
    onClose,
    onAdd
}) => {
    const { darkMode } = useThemeContext();
    const [newHabit, setNewHabit] = useState({
        name: '',
        target: 1,
        unit: 'times',
        color: '#4F46E5',
        icon: getRandomHabitIcon()
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabit.name) return;

        onAdd(newHabit);

        // Reset form
        setNewHabit({
            name: '',
            target: 1,
            unit: 'times',
            color: '#4F46E5',
            icon: getRandomHabitIcon()
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className={`w-full max-w-md p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Habit</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="habit-name" className="block mb-2">Habit Name</label>
                                <input
                                    type="text"
                                    id="habit-name"
                                    value={newHabit.name}
                                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                                    placeholder="E.g., Drink Water, Exercise, Read..."
                                    className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="habit-target" className="block mb-2">Daily Target</label>
                                    <input
                                        type="number"
                                        id="habit-target"
                                        min="1"
                                        value={newHabit.target}
                                        onChange={(e) => setNewHabit({ ...newHabit, target: parseInt(e.target.value) })}
                                        className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="habit-unit" className="block mb-2">Unit</label>
                                    <select
                                        id="habit-unit"
                                        value={newHabit.unit}
                                        onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                                        className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                                    >
                                        <option value="times">times</option>
                                        <option value="minutes">minutes</option>
                                        <option value="hours">hours</option>
                                        <option value="glasses">glasses</option>
                                        <option value="pages">pages</option>
                                        <option value="steps">steps</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Habit Color</label>
                                <div className="flex space-x-2">
                                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewHabit({ ...newHabit, color })}
                                            className={`w-8 h-8 rounded-full ${newHabit.color === color ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}`}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    className="mr-2"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Add Habit
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddHabitModal;