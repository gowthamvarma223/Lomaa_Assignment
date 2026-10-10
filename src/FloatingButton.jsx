import React, { useState, useEffect } from 'react';

export default function FloatingButton({ onClick }) {
    const [position, setPosition] = useState({ x: null, y: null });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Keep floating button pinned or safely bounded when window or inspector resizes
    useEffect(() => {
        const updatePositionOnResize = () => {
            setPosition(prev => {
                const maxX = window.innerWidth - 70;
                const maxY = window.innerHeight - 70;
                if (prev.x === null || prev.y === null || prev.x > maxX || prev.y > maxY) {
                    return {
                        x: Math.max(10, window.innerWidth - 80),
                        y: Math.max(10, window.innerHeight - 80)
                    };
                }
                return {
                    x: Math.max(10, Math.min(maxX, prev.x)),
                    y: Math.max(10, Math.min(maxY, prev.y))
                };
            });
        };

        updatePositionOnResize();
        window.addEventListener('resize', updatePositionOnResize);
        
        // Also listen for resize observer or window dimension changes (such as DevTools toggle)
        const interval = setInterval(updatePositionOnResize, 500);

        return () => {
            window.removeEventListener('resize', updatePositionOnResize);
            clearInterval(interval);
        };
    }, []);

    const handlePointerDown = (e) => {
        setIsDragging(false);
        const currentX = position.x ?? (window.innerWidth - 80);
        const currentY = position.y ?? (window.innerHeight - 80);
        setDragOffset({
            x: e.clientX - currentX,
            y: e.clientY - currentY
        });
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (e.buttons === 0) return;
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        if (Math.abs(newX - (position.x || 0)) > 3 || Math.abs(newY - (position.y || 0)) > 3) {
            setIsDragging(true);
        }
        setPosition({
            x: Math.max(10, Math.min(window.innerWidth - 70, newX)),
            y: Math.max(10, Math.min(window.innerHeight - 70, newY))
        });
    };

    const handlePointerUp = () => {
        if (!isDragging) {
            onClick();
        }
        setIsDragging(false);
    };

    const posX = position.x !== null ? position.x : Math.max(10, window.innerWidth - 80);
    const posY = position.y !== null ? position.y : Math.max(10, window.innerHeight - 80);

    return (
        <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ left: `${posX}px`, top: `${posY}px` }}
            className="fixed z-50 w-14 h-14 bg-slate-900 hover:bg-black text-white rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform hover:scale-110 select-none border-2 border-white/20"
            title="Drag to move or click to open capture popup"
        >
            <i className="fa-solid fa-camera text-lg"></i>
        </div>
    );
}