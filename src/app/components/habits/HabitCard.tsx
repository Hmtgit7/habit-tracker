'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '../types';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import { formatDate } from '../utils/dateHelpers';
import { calculateProgress } from '../utils/habitHelpers';

interface HabitCardProps {
    habit: Habit;
    onUpdate: () => void;
    onDelete: () => void;
    showActions?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
    habit,
    onUpdate,
    onDelete,
    showActions = true
}) => {
    return (
        <Card
            isHoverable
            leftBorderColor={habit.color}
            className="h-full"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <span className="text-xl mr-2">{habit.icon}</span>
                    <div>
                        <h3 className="font-medium">{habit.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Target: {habit.target} {habit.unit}/day</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center">
                        <span className="text-sm font-bold mr-1">{habit.streak}</span>
                        <span className="text-sm">🔥</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Last updated: {formatDate(habit.lastUpdated)}
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                    <span>{habit.current} / {habit.target} {habit.unit}</span>
                    <span>{calculateProgress(habit.current, habit.target)}%</span>
                </div>
                <ProgressBar
                    progress={calculateProgress(habit.current, habit.target)}
                    color={habit.color}
                />
            </div>

            {showActions && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                        variant="primary"
                        onClick={onUpdate}
                    >
                        Update
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default HabitCard;