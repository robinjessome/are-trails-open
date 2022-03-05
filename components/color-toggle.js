import React, { useEffect, useState } from 'react';


export default function ColoToggle({ children }) {
    
    const [checked, setChecked] = useState(false)
    const [lightToggle, setLightToggle] = useState('text-yellow-500')
    const [darkToggle, setDarkToggle] = useState('text-slate-400')
    // let darkToggle, lightToggle;
    
    const handleChange = () => {
        const body = document.querySelector("body");
        setChecked(!checked);
        
        if (!checked) {
            setLightToggle('text-slate-600');
            setDarkToggle('text-slate-200');
            body.classList.add('dark');
        } else {
            setLightToggle('text-yellow-500');
            setDarkToggle('text-slate-400');


            body.classList.remove('dark')
        }
      };

    return (
        <div className="mt-2">
            <label htmlFor="colorScheme" className="text-slate-500 flex items-center">
                <span className={`${lightToggle}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </span>
                <span className={` ${darkToggle}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative -top-[1px]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                </span>
            {/* {checked ? 'dark!' : 'Light' }     */}
            </label>
            <input 
                type="checkbox"
                className="hidden" 
                id="colorScheme" 
                checked={checked}
                onChange={handleChange} 
            />
        </div>
    )
  }