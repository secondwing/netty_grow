import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansKR',
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 40,
        backgroundColor: '#ffffff'
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#4f46e5',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4f46e5'
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#000000'
    },
    content: {
        flex: 1
    }
});

const ReportPage = ({ title, children }) => {
    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.content}>
                {children}
            </View>

            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
    );
};

export default ReportPage;
