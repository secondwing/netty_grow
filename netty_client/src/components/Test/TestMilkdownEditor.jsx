import React, { useState } from 'react';
import { MilkdownProvider, useEditor, Milkdown } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { history } from '@milkdown/plugin-history';
import { indent, indentConfig } from '@milkdown/plugin-indent';

import './TestMilkdownEditor.css'; // We'll create this for specific styles if needed

const MilkdownEditor = ({ value, onChange }) => {
    useEditor((root) => {
        return Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, value);
                ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
                    if (onChange) {
                        onChange(markdown);
                    }
                });
            })
            .config(nord)
            .use(commonmark)
            .use(gfm)
            .use(history)
            .use(listener);
    }, []);

    return <Milkdown />;
};

function TestMilkdownEditor() {
    // Local state for testing, mimicking the structure of GrowthReflection
    const [localPlan, setLocalPlan] = useState({
        year: 2026,
        reflection: {
            summary: '',
            detail: '# 2026년 성장 소감\n\n여기에 자유롭게 작성해보세요.'
        }
    });

    const handleReflectionChange = (field, value) => {
        setLocalPlan({
            ...localPlan,
            reflection: {
                ...localPlan.reflection,
                [field]: value
            }
        });
    };

    return (
        <div className="growth-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">Milkdown 에디터 테스트 페이지</h2>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        * 이 페이지는 DB에 저장되지 않는 테스트용입니다.
                    </div>
                </div>

                <div className="growth-reflection-container">
                    <div className="growth-form-group">
                        <label>{localPlan.year}년 한 문장 요약</label>
                        <input
                            type="text"
                            className="growth-input growth-input--large"
                            value={localPlan.reflection?.summary || ''}
                            onChange={(e) => handleReflectionChange('summary', e.target.value)}
                            placeholder="올해를 한 문장으로 표현한다면?"
                        />
                    </div>

                    <div className="growth-form-group">
                        <label>본문 (Milkdown Editor)</label>
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', minHeight: '500px', background: 'white' }}>
                            <MilkdownProvider>
                                <MilkdownEditor
                                    value={localPlan.reflection?.detail || ''}
                                    onChange={(val) => handleReflectionChange('detail', val)}
                                />
                            </MilkdownProvider>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                        <h3>실시간 데이터 확인 (State)</h3>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {JSON.stringify(localPlan, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestMilkdownEditor;
