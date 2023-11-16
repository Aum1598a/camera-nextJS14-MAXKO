'use client'
import React, { useEffect, useState } from 'react';

export const Orientation = () => {
    const [orientation, setOrientation] = useState<string | null>(getOrientation());

    const handleOrientationChange = () => {
        setOrientation(getOrientation());
    };

    useEffect(() => {
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    function getOrientation() {
        const angle =0// window.orientation || (window.screen as any).orientation?.angle || 0;

        if (angle === 0 || angle === 180) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    }

    return (
        <div>
            <p>Current Orientation: {orientation}</p>
        </div>
    );
};
