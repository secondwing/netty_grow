import React from 'react';

const KakaoFloatingButton = () => {
    return (
        <a
            href="https://pf.kakao.com/_PVCiG/chat"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '6rem', // Positioned to the left of ScrollToTop (right: 2rem + 3rem + 1rem gap)
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#fee500', // Kakao Yellow background in case image has transparency or fails
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            aria-label="KakaoTalk Chat"
        >
            <img
                src="/logo/kakao_logo.png"
                alt="KakaoTalk"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </a>
    );
};

export default KakaoFloatingButton;
