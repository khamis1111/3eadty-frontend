import React, { useEffect } from 'react'
import Typed from 'typed.js';

const TypedStr = ({ element, arrOfStr }) => {
    useEffect(() => {
        const typed = new Typed('.element', {
            strings: arrOfStr,
            typeSpeed: 150,
            backSpeed: 150,
            loop: true,
        });
        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        };
    }, []);
    return (
        <div>
            <span>{element}</span> <span className='element'></span>
        </div>
    )
}

export default TypedStr
