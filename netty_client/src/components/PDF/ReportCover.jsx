import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansKR',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 36,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#4f46e5'
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
        color: '#000000'
    },
    info: {
        fontSize: 14,
        color: '#000000',
        marginTop: 10
    },
    divider: {
        width: 100,
        height: 2,
        backgroundColor: '#4f46e5',
        marginVertical: 30
    }
});

const ReportCover = ({ year, userName }) => {
    const today = new Date().toLocaleDateString();

    return (
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>{year}년 성장 기록 리포트</Text>
            <Text style={styles.subtitle}>나의 성장을 기록하고 증명하다</Text>

            <View style={styles.divider} />

            <Text style={styles.info}>작성자: {userName}</Text>
            <Text style={styles.info}>발행일: {today}</Text>
        </Page>
    );
};

export default ReportCover;
