import React, { useMemo } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './ContributionGraph.css';

const ContributionGraph = ({ records }) => {
    // Process records to get counts per date
    const data = useMemo(() => {
        const counts = {};
        if (records && records.length > 0) {
            records.forEach(record => {
                if (!record.date) return;
                const dateObj = new Date(record.date);
                if (isNaN(dateObj.getTime())) return; // Skip invalid dates

                const date = dateObj.toISOString().split('T')[0];
                counts[date] = (counts[date] || 0) + 1;
            });
        }

        // Generate last 365 days (or at least cover the range)
        // We need to ensure we have data for the visualization. 
        // Let's generate a full year range ending today.
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const result = [];
        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const count = counts[dateStr] || 0;
            // Level 0-4 based on count
            let level = 0;
            if (count >= 1) level = 1;
            if (count >= 3) level = 2;
            if (count >= 5) level = 3;
            if (count >= 7) level = 4;

            result.push({
                date: dateStr,
                count: count,
                level: level
            });
        }
        return result;
    }, [records]);

    // Calculate stats
    const stats = useMemo(() => {
        if (!records) return { total: 0, streak: 0, maxStreak: 0 };

        const total = records.length;

        // Calculate streaks
        // Calculate streaks
        const sortedDates = [...new Set(records
            .filter(r => r.date && !isNaN(new Date(r.date).getTime())) // Filter invalid dates
            .map(r => new Date(r.date).toISOString().split('T')[0])
        )].sort();

        let currentStreak = 0;
        let maxStreak = 0;
        let tempStreak = 0;

        // Check if today or yesterday has a record to count current streak
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const hasToday = sortedDates.includes(todayStr);
        const hasYesterday = sortedDates.includes(yesterdayStr);

        if (!hasToday && !hasYesterday) {
            currentStreak = 0;
        } else {
            // Calculate backwards from today/yesterday
            // This is a bit complex, let's just iterate sorted dates to find max streak
            // and then check the end for current streak.
        }

        // Simple iteration for max streak
        let prevDate = null;
        for (const dateStr of sortedDates) {
            const currentDate = new Date(dateStr);
            if (prevDate) {
                const diffTime = Math.abs(currentDate - prevDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            } else {
                tempStreak = 1;
            }
            if (tempStreak > maxStreak) maxStreak = tempStreak;
            prevDate = currentDate;
        }

        // Current streak
        // If last record is today or yesterday, count backwards
        if (sortedDates.length > 0) {
            const lastDateStr = sortedDates[sortedDates.length - 1];
            if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
                currentStreak = 1;
                for (let i = sortedDates.length - 2; i >= 0; i--) {
                    const curr = new Date(sortedDates[i + 1]);
                    const prev = new Date(sortedDates[i]);
                    const diffTime = Math.abs(curr - prev);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }

        return { total, streak: currentStreak, maxStreak };
    }, [records]);

    return (
        <div className="contribution-graph">
            <div className="contribution-graph__stats">
                <div className="contribution-graph__stat">
                    <span className="contribution-graph__stat-value">{stats.total}</span>
                    <span className="contribution-graph__stat-label">Total Records</span>
                </div>
                <div className="contribution-graph__stat">
                    <span className="contribution-graph__stat-value">{stats.streak}</span>
                    <span className="contribution-graph__stat-label">Current Streak</span>
                </div>
                <div className="contribution-graph__stat">
                    <span className="contribution-graph__stat-value">{stats.maxStreak}</span>
                    <span className="contribution-graph__stat-label">Max Streak</span>
                </div>
            </div>

            <div className="contribution-graph__calendar">
                <ActivityCalendar
                    data={data}
                    colorScheme="light"
                    theme={{
                        light: ['#f2e8cf', '#a7c957', '#6a994e', '#386641', '#bc4749'],
                        dark: ['#f2e8cf', '#a7c957', '#6a994e', '#386641', '#bc4749'],
                    }}
                    labels={{
                        totalCount: '{{count}} records in the last year',
                    }}
                    renderBlock={(block, activity) =>
                        React.cloneElement(block, {
                            'data-tooltip-id': 'react-tooltip',
                            'data-tooltip-content': `${activity.date}: ${activity.count} records`,
                        })
                    }
                />
                <Tooltip id="react-tooltip" />
            </div>
        </div>
    );
};

export default ContributionGraph;
