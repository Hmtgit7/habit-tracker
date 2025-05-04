'use client';

import React from 'react';
import { useHabitContext } from '../providers/HabitProvider';
import Card from '../common/Card';
import CompletionDistribution from './CompletionDistribution';
import StreakAnalysis from './StreakAnalysis';
import HabitAnalytics from './HabitAnalytics';

const InsightsView: React.FC = () => {
    const { habits } = useHabitContext();

    return (
        <div className="space-y-6 pb-8">
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Habit Insights</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CompletionDistribution habits={habits} />
                    <StreakAnalysis habits={habits} />
                </div>
            </Card>

            <Card className="p-6">
                <HabitAnalytics />
            </Card>
        </div>
    );
};

export default InsightsView;