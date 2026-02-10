import React from 'react';
import {
    Sprout, Sparkles, PenTool, Target, Calendar,
    BarChart2, FileText, ScrollText, Heart, TrendingUp
} from 'lucide-react';
import './GrowthRecord.css';

const GrowthIntro = () => {
    return (
        <div className="growth-section growth-intro-container">
            <div className="intro-header">
                <h2 className="icon-heading"><Sprout className="icon-main" /> 성장 기록</h2>
                <h3>나를 다루는 법을 배우는 1년 간의 기록 활동</h3>
                <p>
                    나성장 기록은 <strong>나를 이해하고, 나에게 맞는 삶의 방향을 만들어가는 기록 활동</strong>입니다.
                </p>
            </div>

            <div className="intro-card intro-about">
                <h4 className="icon-heading"><Sparkles className="icon-accent" /> 나성장 기록은 이런 활동이에요</h4>
                <p>
                    나성장은 1년을 기준으로 <strong>계획 → 실행 → 점검 → 회복</strong>의 흐름을 반복하며 스스로를 다루는 힘을 기르는 자기분석 기록입니다.
                </p>
                <ul>
                    <li>나로 부터 동기화하고</li>
                    <li>내가 어떤 사람인지 알고</li>
                    <li>왜 같은 지점에서 반복되는지 이해하며</li>
                    <li>강점으로 약점을 보완하는 방법을 배웁니다.</li>
                </ul>
            </div>

            <div className="intro-card intro-how">
                <h4 className="icon-heading"><PenTool className="icon-accent" /> 이렇게 기록해요</h4>
                <div className="how-grid">
                    <div className="how-item">
                        <h5 className="icon-heading"><Target className="icon-sub" /> 1. 나의 성장계획</h5>
                        <p>원하는 나의 모습과<br />1년간의 성장 목표를 정리합니다.</p>
                    </div>
                    <div className="how-item">
                        <h5 className="icon-heading"><Calendar className="icon-sub" /> 2. 월 성장일지</h5>
                        <p>매월 목표를 실천하며<br />행동과 결과, 생각과 감정을 기록합니다.</p>
                    </div>
                    <div className="how-item">
                        <h5 className="icon-heading"><BarChart2 className="icon-sub" /> 3. 월 성장분석</h5>
                        <p>기록을 바탕으로<br />나의 반복되는 패턴과 환경을 분석합니다.<br /><span className="text-sm text-gray-500">(AI가 요약·정리를 도와줘요)</span></p>
                    </div>
                    <div className="how-item">
                        <h5 className="icon-heading"><FileText className="icon-sub" /> 4. 연 성장결과 & 소감</h5>
                        <p>1년간의 기록을 종합해<br />나만의 성장 결과 보고서를 완성합니다.</p>
                    </div>
                </div>
            </div>

            <div className="intro-card intro-change">
                <h4 className="icon-heading"><Sparkles className="icon-accent" /> 나성장을 통해 얻는 변화</h4>
                <div className="table-responsive">
                    <table className="intro-table">
                        <thead>
                            <tr>
                                <th>기록 과정</th>
                                <th>경험하게 되는 변화</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>성장 계획</strong></td>
                                <td>내가 원하는 삶의 방향이 분명해지면서 <strong>안정감</strong>을 느껴요.</td>
                            </tr>
                            <tr>
                                <td><strong>월간 기록</strong></td>
                                <td>감정·생각·행동을 구분해 바라보며 <strong>나를 객관적으로 인식</strong>하게 돼요</td>
                            </tr>
                            <tr>
                                <td><strong>월간 점검</strong></td>
                                <td>매달 스스로를 점검하며 <strong>나에게 맞는 환경</strong>을 만들어가요.</td>
                            </tr>
                            <tr>
                                <td><strong>기록 반복</strong></td>
                                <td>나의 반복되는 강점과 약점의 패턴을 이해하며, <strong>나를 다루는 힘</strong>이 생겨요.</td>
                            </tr>
                            <tr>
                                <td><strong>연간 정리</strong></td>
                                <td>1년의 성장을 <strong>시각화·문서화하며 성취감</strong>과 안정감을 느껴요</td>
                            </tr>
                            <tr>
                                <td><strong>커뮤니티 참여</strong></td>
                                <td>혼자가 아니라 <strong>함께 독려하며 기록을 지속</strong>할 수 있어요</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="intro-card intro-timeline">
                <h4 className="icon-heading"><TrendingUp className="icon-accent" /> 1년간의 나성장 과정 (월 1회 점검 기준)</h4>
                <p className="timeline-desc">
                    나성장 기록의 변화는 갑작스럽게 오지 않고, <strong>단계적으로 찾아와요.</strong><br />
                    대부분의 참여자가 아래와 같은 흐름을 경험합니다.
                </p>
                <div className="timeline-list">
                    <div className="timeline-item">
                        <div className="timeline-marker">1–3개월차</div>
                        <div className="timeline-content">
                            <h5>기록에 익숙해지는 시기</h5>
                            <ul>
                                <li>나성장 기록 작성법을 익혀요</li>
                                <li>나와 관련된 정보들을 수집하는 단계예요</li>
                                <li>아직 변화보다 “적는 것 자체”에 집중해요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">4개월차</div>
                        <div className="timeline-content">
                            <h5>자기 객관화</h5>
                            <ul>
                                <li>나의 감정과 생각을 인지하기 시작해요</li>
                                <li>“아, 내가 이럴 때 이렇게 반응하는구나”를 알게 돼요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">5개월차</div>
                        <div className="timeline-content">
                            <h5>자기 이해</h5>
                            <ul>
                                <li>반복되는 패턴이 보이기 시작해요</li>
                                <li>나의 강점과 약점에 대한 핵심 키워드가 생겨요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">6개월차</div>
                        <div className="timeline-content">
                            <h5>자기 인정</h5>
                            <ul>
                                <li>잘한 모습뿐 아니라 부족한 모습도 받아들이게 돼요</li>
                                <li>스스로를 조금 더 사랑하는 연습이 시작돼요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">7개월차</div>
                        <div className="timeline-content">
                            <h5>루틴의 흔들림</h5>
                            <ul>
                                <li>일상이 버거워지고 기록이 잠시 멈출 수도 있어요</li>
                                <li>이 시기는 <strong>많은 사람이 겪는 자연스러운 구간</strong>이에요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">8개월차</div>
                        <div className="timeline-content">
                            <h5>회복기</h5>
                            <ul>
                                <li>다시 나에게 돌아오기 위한 방법을 찾기 시작해요</li>
                                <li>마음을 다루는 법을 배우는 시기예요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">9개월차</div>
                        <div className="timeline-content">
                            <h5>안정기</h5>
                            <ul>
                                <li>나에게 맞는 리듬과 패턴을 다시 잡아가요</li>
                                <li>‘결국 나를 돌보는 게 가장 중요하다’는 걸 체감해요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">10개월차</div>
                        <div className="timeline-content">
                            <h5>자기 역량 강화</h5>
                            <ul>
                                <li>나에게 필요한 역량이 무엇인지 분명해져요</li>
                                <li>그 역량을 채우는 방법을 찾기 시작해요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">11개월차</div>
                        <div className="timeline-content">
                            <h5>환경 만들기</h5>
                            <ul>
                                <li>나에게 맞는 환경과 관계를 스스로 선택하게 돼요</li>
                                <li>성장을 유지할 수 있는 구조가 생겨요</li>
                            </ul>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker">12개월차</div>
                        <div className="timeline-content">
                            <h5>나다움의 지속</h5>
                            <ul>
                                <li>목표보다 <strong>현재의 상태, 행복, 충만함</strong>에 집중해요</li>
                                <li>‘나답게 사는 감각’을 일상에서 유지하게 돼요</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="intro-card intro-history">
                <h4 className="icon-heading"><ScrollText className="icon-accent" /> 나성장 활동 연혁</h4>
                <div className="history-list">
                    <div className="history-item">
                        <div className="history-year">2015–2019</div>
                        <div className="history-content">
                            <strong>드림북 개인 기록 활동 시작</strong>
                            <p>(수기 작성으로 나를 알아가는 기록 실천)</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">2020</div>
                        <div className="history-content">
                            <strong>나성장계발서 1기 모임 진행</strong>
                            <p>(지인 모집, 10명) → 기록 양식을 <strong>한글 파일 형태로 구조화</strong></p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">2021</div>
                        <div className="history-content">
                            <strong>나성장계발서 2기 모임 진행</strong>
                            <p>(소모임 앱 모집, 4명)</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">2022</div>
                        <div className="history-content">
                            <strong>나성장계발서 3기 모임 진행</strong>
                            <p>(천안 청년 대상, 8명)</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">2023</div>
                        <div className="history-content">
                            <strong>나성장계발서 4기 모임 진행</strong>
                            <p>(천안 청년 대상, 8명)</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">2024</div>
                        <div className="history-content">
                            <strong>나성장계발서 5기 모임 진행</strong>
                            <p>(SNS 홍보 모집, 10명)</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">2025</div>
                        <div className="history-content">
                            <strong>나성장계발서 6기 모임 진행</strong>
                            <p>(SNS 홍보 모집, 21명)</p>
                        </div>
                    </div>
                    <div className="history-item highlight">
                        <div className="history-year">2026</div>
                        <div className="history-content">
                            <strong>나성장 기록 플랫폼 전환</strong>
                            <p>(기록의 편의성과 성장 과정의 시각화를 위해 디지털 플랫폼으로 확장)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="intro-card intro-participation">
                <h4 className="icon-heading"><Heart className="icon-accent" /> 나성장 참여방법</h4>
                <p>나성장 기록은 지금의 나에게 맞는 방식으로 참여할 수 있어요.</p>
                <div className="participation-grid">
                    <div className="participation-card">
                        <h5>개인</h5>
                        <p className="desc">기록은 혼자서도 충분히 시작할 수 있어요.</p>
                        <div className="price">무료</div>
                        <ul>
                            <li>일상기록 & 나성장 기록 작성</li>
                            <li>AI 성장분석 이용 가능</li>
                            <li>PDF 다운로드 가능</li>
                        </ul>
                    </div>
                    <div className="participation-card highlight">
                        <h5>커뮤니티</h5>
                        <p className="desc">혼자서 조금 어렵게 느껴진다면, 함께 성장해요!</p>
                        <div className="price">월 5만원 / 6개월 25만원</div>
                        <ul>
                            <li>일상·성장기록 + AI 성장분석 + PDF</li>
                            <li>1:1 기록 피드백 및 성장 점검</li>
                            <li>기록 기반 맞춤형 추천 제공</li>
                            <li>
                                커뮤니티 독려 모임 참여 (선택)
                                <ul className="participation-sublist">
                                    <li>기록을 꾸준히 이어가기 위해 <strong>함께 응원하고 확인하는 모임</strong>이에요.</li>
                                    <li>독려비 월 1만원, 6개월 5만원을 추가 납부</li>
                                    <li>성장기록 작성완료시, 100% 환급돼요!</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowthIntro;
