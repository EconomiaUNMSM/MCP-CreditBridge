'use client';

import { useState, useRef, useEffect } from 'react';

interface InfoTooltipProps {
    title: string;
    content: string;
}

export default function InfoTooltip({ title, content }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<'top' | 'bottom'>('top');
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isVisible && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // If there's not enough space above, show below
            if (rect.top < 150) {
                setPosition('bottom');
            } else {
                setPosition('top');
            }
        }
    }, [isVisible]);

    return (
        <div className="relative inline-flex items-center ml-1.5">
            <button
                ref={buttonRef}
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                className="text-slate-300 hover:text-blue-500 transition-colors cursor-help focus:outline-none"
                aria-label={`More information about ${title}`}
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {isVisible && (
                <div
                    className={`fixed w-72 p-3.5 bg-slate-800 text-white text-[10px] rounded-lg shadow-2xl z-[9999] animate-in fade-in zoom-in duration-200 pointer-events-none
                        ${position === 'top' ? '-translate-y-full -mt-2' : 'mt-2'}
                    `}
                    style={{
                        left: buttonRef.current ? `${buttonRef.current.getBoundingClientRect().left + buttonRef.current.offsetWidth / 2}px` : '0',
                        top: position === 'top'
                            ? buttonRef.current ? `${buttonRef.current.getBoundingClientRect().top}px` : '0'
                            : buttonRef.current ? `${buttonRef.current.getBoundingClientRect().bottom}px` : '0',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <p className="font-bold text-blue-300 mb-1.5 border-b border-slate-700/50 pb-1 uppercase tracking-widest text-[9px]">
                        {title}
                    </p>
                    <p className="leading-relaxed opacity-95 text-slate-100 font-normal normal-case tracking-normal">
                        {content}
                    </p>
                    {/* Arrow */}
                    <div
                        className={`absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent
                            ${position === 'top' ? 'top-full -mt-1 border-t-slate-800' : 'bottom-full -mb-1 border-b-slate-800'}
                        `}
                    />
                </div>
            )}
        </div>
    );
}
