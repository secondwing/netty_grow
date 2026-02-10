import React, { useState, useRef, useEffect } from 'react';
import { Smile, X } from 'lucide-react';

const UNICODE_CHARS = [
    // Shapes & Symbols (Requested Priority)
    '※', '○', '●', '□', '■', '◇', '◆', '▲', '▼', '◀', '▶',
    '★', '☆', '✓', '✔', '✕', '✖', '➤', '➜', '➔', '➙',
    '☺', '☹', '❤', '♡', '☀', '☁', '☂', '☃', '☎', '☏',
    '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
    '†', '‡', '§', '¶', '©', '®', '™', '@', '#',
    '♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟',
    '♩', '♪', '♫', '♬', '♭', '♮', '♯'
];

const FloatingUnicodePicker = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const pickerRef = useRef(null);

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [pickerRef]);

    const handleCharClick = (char) => {
        navigator.clipboard.writeText(char).then(() => {
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 1500);
        });
    };

    return (
        <div ref={pickerRef} style={{ position: 'fixed', bottom: '6rem', right: '6rem', zIndex: 1000 }}>
            {/* Toggle Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    color: '#4f46e5',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                title="특수문자 입력"
            >
                {isOpen ? <X size={24} /> : <Smile size={24} />}
            </button>

            {/* Popup */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    right: 0,
                    marginBottom: '1rem',
                    width: '320px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    padding: '1rem',
                    zIndex: 1001,
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        borderBottom: '1px solid #f3f4f6',
                        paddingBottom: '0.5rem'
                    }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>특수문자 (클릭하여 복사)</span>
                        {showCopied && (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 500 }}>복사되었습니다!</span>
                        )}
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(8, 1fr)',
                        gap: '4px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}>
                        {UNICODE_CHARS.map((char, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleCharClick(char)}
                                style={{
                                    background: 'none',
                                    border: '1px solid transparent',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    aspectRatio: '1/1',
                                    transition: 'all 0.2s',
                                    color: '#374151'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                                title="복사하기"
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingUnicodePicker;
