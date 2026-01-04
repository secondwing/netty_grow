import React, { useState, useEffect } from 'react';

const LoadingButton = ({ onClick, defaultText = 'AI로 초안 작성하기', loadingText = '생성중', className, style, ...props }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        let interval;
        if (isLoading) {
            interval = setInterval(() => {
                setDots(prev => {
                    if (prev.length >= 3) return '';
                    return prev + '.';
                });
            }, 500);
        } else {
            setDots('');
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLoading]);

    const handleClick = async (e) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await onClick(e);
        } catch (error) {
            console.error("Error in LoadingButton:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            className={className}
            onClick={handleClick}
            disabled={isLoading}
            style={{
                ...style,
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1
            }}
            {...props}
        >
            {isLoading ? `${loadingText}${dots}` : defaultText}
        </button>
    );
};

export default LoadingButton;
