import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import ReportCover from './ReportCover';
import ReportPage from './ReportPage';
import SectionPlan from './SectionPlan';
import SectionMonthly from './SectionMonthly';
import SectionYearly from './SectionYearly';

import SectionReflection from './SectionReflection';

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

            {/* 1. Growth Plan */}
            <ReportPage title="성장 계획">
                <SectionPlan plan={plan} />
            </ReportPage>

            {/* 2. Monthly Logs (Activity Logs) */}
            {monthlyLogs && monthlyLogs.map((log, index) => (
                <ReportPage key={`log-${index}`} title={`${log.month}월 성장일지`}>
                    <SectionMonthly log={log} plan={plan} mode="log" />
                </ReportPage>
            ))}

            {/* 3. Monthly Analysis */}
            {monthlyLogs && monthlyLogs.map((log, index) => (
                <ReportPage key={`analysis-${index}`} title={`${log.month}월 성장분석`}>
                    <SectionMonthly log={log} plan={plan} mode="analysis" />
                </ReportPage>
            ))}

            {/* 4. Yearly Result Report */}
            <ReportPage title="연 결과보고서">
                <SectionYearly plan={plan} />
            </ReportPage>

            {/* 5. Growth Reflection */}
            <ReportPage title="성장 소감">
                <SectionReflection plan={plan} />
            </ReportPage>
        </Document>
    );
};

export default GrowthReportDocument;
