import React from "react";
import { useEffect, useState } from "react";


export default function Component({ setstate,reason }) {
    const [time, setTime] = useState(5); 

    useEffect(() => {
    
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        
        const timeout = setTimeout(() => {
            setstate(0);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [setstate]);

    return (
        <div className="flex flex-col bg-black animate-in fade-in zoom-in duration-500 text-white h-screen w-full justify-center">
            <div className="text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl inline-flex items-center">
                       
                        Attendance Marking Failure
                    </h1>
                </div>
                <div className="p-4 max-w-sm mx-auto">
                <div className="space-y-1 text-center flex-col">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Reason: {`Face not detected in the camera`}
                                </p>
                            </div>
                </div>
            </div>
            {time > 0 && <p className="text-center text-gray-500 dark:text-gray-400">Going back in {time} seconds</p>}
        </div>
    );
}