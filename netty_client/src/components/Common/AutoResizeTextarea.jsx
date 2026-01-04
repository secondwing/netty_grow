import React, { useEffect, useRef } from 'react';

const AutoResizeTextarea = ({ value, onChange, placeholder, className, minHeight = '100px', ...props }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height to auto to correctly calculate new scrollHeight
        textarea.style.height = 'auto';

        // Set new height based on scrollHeight, but respect minHeight
        const newHeight = Math.max(textarea.scrollHeight, parseInt(minHeight));
        textarea.style.height = `${newHeight}px`;
    }, [value, minHeight]);

    return (
        <textarea
            ref={textareaRef}
            className={className}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
                minHeight: minHeight,
                overflow: 'hidden', // Hide scrollbar while auto-resizing
                resize: 'none' // Disable manual resize as it conflicts with auto-resize
            }}
            {...props}
        />
    );
};

export default AutoResizeTextarea;
