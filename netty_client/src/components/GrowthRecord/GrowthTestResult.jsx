import React from 'react';
import { GROWTH_ANALYSIS_DATA } from '../../data/growthAnalysisData';

const GrowthTestResult = ({ stage }) => {
    const analysis = GROWTH_ANALYSIS_DATA[stage] || GROWTH_ANALYSIS_DATA[1];

    return (
        <div className="analysis-card">
            <div className="analysis-header">
                <h3 className="analysis-title">{analysis.title}</h3>
                <p className="analysis-subtitle">{analysis.subtitle}</p>
            </div>

            <img
                src={`/growth/growth_0${stage}.png`}
                alt={`${analysis.title} growth stage`}
                className="analysis-image"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/growth/growth_01.png';
                }}
            />

            <div className="analysis-content">
                <div className="analysis-description">
                    {analysis.description.map((line, index) => (
                        <p key={index} dangerouslySetInnerHTML={{
                            __html: line.trim() === '' ? '&nbsp;' : line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    ))}
                </div>

                <div className="analysis-section tip-section">
                    <h4>👉 성장tip</h4>
                    <p>{analysis.tip}</p>
                </div>

                <div className="analysis-section recommend-section">
                    <h4>추천 기록법</h4>
                    <ul>
                        {analysis.recommendation.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GrowthTestResult;
