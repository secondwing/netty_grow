import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4f46e5',
        marginBottom: 10,
        marginTop: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#4f46e5',
        padding: 5
    },
    logItem: {
        marginBottom: 10,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#000000'
    },
    activityName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 2
    },
    logContent: {
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.4
    },
    analysisGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    analysisBox: {
        width: '48%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 4
    },
    fullWidthBox: {
        width: '100%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 4
    },
    boxLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 5
    },
    boxContent: {
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.4
    }
});

const SectionMonthly = ({ log, plan }) => {
    if (!log) return <Text>기록이 없습니다.</Text>;

    // Helper to find activity content by ID
    const getActivityContent = (activityId) => {
        if (!plan) return 'Unknown Activity';
        for (const item of plan.items) {
            const activity = item.activities.find(a => a._id === activityId);
            if (activity) return activity.content;
        }
        return 'Unknown Activity';
    };

    // Helper to find item goal by ID
    const getItemGoal = (itemId) => {
        if (!plan) return 'Unknown Item';
        const item = plan.items.find(i => i._id === itemId);
        return item ? item.goal : 'Unknown Item';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>월간 활동 지표</Text>
            {log.activityLogs && log.activityLogs.map((l, i) => (
                <View key={i} style={styles.logItem}>
                    <Text style={styles.activityName}>{getActivityContent(l.activityId)}</Text>
                    <Text style={styles.logContent}>{l.log || '기록 없음'}</Text>
                </View>
            ))}

            <Text style={styles.sectionTitle}>월간 성장 분석</Text>
            <View style={styles.analysisGrid}>
                {log.itemAnalyses && log.itemAnalyses.map((analysis, i) => (
                    <View key={i} style={{ width: '100%', marginBottom: 15 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
                            목표: {getItemGoal(analysis.itemId)}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.analysisBox}>
                                <Text style={styles.boxLabel}>강점 (잘한 점)</Text>
                                <Text style={styles.boxContent}>{analysis.strength || '-'}</Text>
                            </View>
                            <View style={styles.analysisBox}>
                                <Text style={styles.boxLabel}>약점 (아쉬운 점)</Text>
                                <Text style={styles.boxContent}>{analysis.weakness || '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.fullWidthBox}>
                            <Text style={styles.boxLabel}>보완 (성장 환경조성)</Text>
                            <Text style={styles.boxContent}>{analysis.supplement || '-'}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default SectionMonthly;
