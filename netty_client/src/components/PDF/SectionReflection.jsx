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
    summaryBox: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb'
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4f46e5',
        marginBottom: 8
    },
    summaryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center'
    },
    detailBox: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        minHeight: 300
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 10
    },
    detailText: {
        fontSize: 11,
        color: '#374151',
        lineHeight: 1.6
    }
});

const SectionReflection = ({ plan }) => {
    if (!plan || !plan.reflection) return <Text>작성된 소감이 없습니다.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>성장 소감</Text>

            <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>{plan.year}년 한 문장 요약</Text>
                <Text style={styles.summaryText}>
                    {plan.reflection.summary || '작성된 요약이 없습니다.'}
                </Text>
            </View>

            <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>본문</Text>
                <Text style={styles.detailText}>
                    {plan.reflection.detail || '작성된 본문이 없습니다.'}
                </Text>
            </View>
        </View>
    );
};

export default SectionReflection;
