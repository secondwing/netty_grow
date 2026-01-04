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
    overviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    overviewBox: {
        width: '31%', // Approx 3 per row
        marginBottom: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 4
    },
    monthTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#4f46e5'
    },
    contentLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 3
    },
    contentText: {
        fontSize: 9,
        color: '#000000',
        marginBottom: 5,
        lineHeight: 1.3
    },
    resultItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#000000'
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    resultGoal: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000000'
    },
    activityRow: {
        marginTop: 5,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#000000'
    }
});

const SectionYearly = ({ plan }) => {
    if (!plan) return <Text>데이터가 없습니다.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>연간 한눈에 정리</Text>
            <View style={styles.overviewGrid}>
                {plan.yearlyOverview && plan.yearlyOverview.map((overview, i) => (
                    <View key={i} style={styles.overviewBox}>
                        <Text style={styles.monthTitle}>{overview.month}월</Text>

                        <Text style={styles.contentLabel}>활동내용</Text>
                        <Text style={styles.contentText}>
                            {overview.content ? (overview.content.length > 50 ? overview.content.substring(0, 50) + '...' : overview.content) : '-'}
                        </Text>

                        <Text style={styles.contentLabel}>핵심요약</Text>
                        <Text style={styles.contentText}>{overview.summary || '-'}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>연간 결과 보고서</Text>
            {plan.items.map((item, i) => (
                <View key={i} style={styles.resultItem}>
                    <Text style={styles.resultGoal}>목표: {item.goal}</Text>
                    {item.activities.map((act, j) => (
                        <View key={j} style={styles.activityRow}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>활동: {act.content}</Text>
                            <Text style={{ fontSize: 10, marginTop: 2 }}>성과: {act.outcome || '-'}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default SectionYearly;
