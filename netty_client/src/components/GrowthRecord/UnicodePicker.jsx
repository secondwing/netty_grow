import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

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

function UnicodePicker({ onInsert }) {
    const [isOpen, setIsOpen] = useState(false);
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
        if (onInsert) {
            onInsert(char);
        } else {
            navigator.clipboard.writeText(char);
        }
    };

    return (
        <div className="unicode-picker" ref={pickerRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                type="button"
                className="unicode-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                }}
                title="특수문자 입력"
            >
                <Smile size={20} />
            </button>

            {isOpen && (
                <div className="unicode-popup" style={{
                    position: 'absolute',
                    bottom: '100%',
                    right: 0,
                    marginBottom: '0.5rem',
                    width: '340px', // Increased width
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    padding: '0.75rem',
                    zIndex: 1000,
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(8, 1fr)',
                        gap: '4px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        overflowX: 'hidden' // Prevent horizontal scroll
                    }}>
                        {UNICODE_CHARS.map((char, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleCharClick(char)}
                                style={{
                                    background: 'none',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    aspectRatio: '1/1',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                title="클릭하여 입력"
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnicodePicker;
