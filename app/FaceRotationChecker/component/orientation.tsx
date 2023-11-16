'use client'
import React, { useEffect, useState } from 'react';

export const Orientation = () => {
    const [orientation, setOrientation] = useState<string | null>(getOrientation());

    const handleOrientationChange = () => {
        setOrientation(getOrientation());
    };

    useEffect(() => {
        handleOrientationChange()
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);



    function getOrientation() {
        if (typeof window !== 'undefined') {
             let angle = window.screen.orientation.angle
            if (angle === 0 || angle === 180) {
                return 'portrait';
            } else {
                return 'landscape';
            }
        }else{
            return null
        }
    }


    // const handleOrientationChange = () => {
    //     console.log(window.innerWidth);
    //     if (typeof window !== 'undefined') {
    //         if (window.innerWidth > window.innerHeight) {
    //         }
    //     }

    // }

    return (
        <div>
            <p>Current Orientation: {orientation}</p>
        </div>
    );
};
