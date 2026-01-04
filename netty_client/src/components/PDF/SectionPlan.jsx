import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    item: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000000'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 5
    },
    label: {
        fontSize: 10,
        color: '#000000',
        width: 60,
        fontWeight: 'bold'
    },
    value: {
        fontSize: 12,
        color: '#000000',
        fontWeight: 'bold',
        flex: 1
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5
    },
    activityTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#4f46e5'
    },
    activity: {
        fontSize: 10,
        color: '#000000',
        marginLeft: 10,
        marginBottom: 2
    }
});

const SectionPlan = ({ plan }) => {
    if (!plan || !plan.items) return <Text>계획 데이터가 없습니다.</Text>;

    return (
        <View style={styles.container}>
            {plan.items.map((item, index) => (
                <View key={index} style={styles.item}>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>목표 {index + 1}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>원하는 나:</Text>
                        <Text style={styles.value}>{item.desiredSelf}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>성장목표:</Text>
                        <Text style={styles.value}>{item.goal}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>동기부여:</Text>
                        <Text style={styles.value}>{item.motivation}</Text>
                    </View>

                    <Text style={styles.activityTitle}>실천 활동</Text>
                    {item.activities.map((act, i) => (
                        <Text key={i} style={styles.activity}>
                            • {act.content}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default SectionPlan;
