import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import ReportCover from './ReportCover';
import ReportPage from './ReportPage';
import SectionPlan from './SectionPlan';
import SectionMonthly from './SectionMonthly';
import SectionYearly from './SectionYearly';

// Register Korean Font
// Register Korean Font
Font.register({
    family: 'NotoSansKR',
    fonts: [
        { src: '/fonts/NotoSansKR-Regular.ttf', fontWeight: 400, format: 'truetype' }, // Regular
        { src: '/fonts/NotoSansKR-Bold.ttf', fontWeight: 700, format: 'truetype' }, // Bold
    ]
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansKR',
        padding: 30,
        backgroundColor: '#ffffff'
    }
});

const GrowthReportDocument = ({ plan, monthlyLogs, user }) => {
    return (
        <Document>
            <ReportCover year={plan.year} userName={user?.name || '사용자'} />

            <ReportPage title="성장 계획">
                <SectionPlan plan={plan} />
            </ReportPage>

            {/* Monthly Logs Loop */}
            {monthlyLogs && monthlyLogs.map((log, index) => (
                <ReportPage key={index} title={`${log.month}월 성장 기록`}>
                    <SectionMonthly log={log} plan={plan} />
                </ReportPage>
            ))}

            <ReportPage title="연간 결과 보고서">
                <SectionYearly plan={plan} />
            </ReportPage>
        </Document>
    );
};

export default GrowthReportDocument;
