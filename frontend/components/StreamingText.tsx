'use client';

import { useState, useEffect } from 'react';

export default function StreamingText({
    text,
    speed = 20
}: {
    text: string;
    speed?: number;
}) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText(""); // Reset text on new input

        if (!text) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index <= text.length) {
                setDisplayedText(text.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <div className="font-sans text-slate-700 leading-relaxed text-sm animate-in fade-in duration-500 notranslate" translate="no">
            {displayedText}
            <span className="w-1.5 h-4 bg-blue-500 inline-block align-middle ml-1 animate-pulse" />
        </div>
    );
}
