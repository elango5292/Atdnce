import React, { useEffect, useState } from "react";

export default function Component({ setstate, message,im }) {
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
        <div className="flex flex-col bg-black gap-y-3 animate-in fade-in zoom-in duration-500 text-white h-screen w-screen justify-center">
            <div className="text-center">
            <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl inline-flex items-center">
                        {/* <TbCameraCheck className=" mr-2"/> */}
                        Attendance Marked Successfully
                    </h1>
                </div>
                <div className="p-4 max-w-sm mx-auto">
                    <div className="max-w-sm mx-auto bg-gradient-to-b from-[#1a1a1a] to-[#020202]">
                        <div className="flex flex-col items-center gap-2 p-4">
                            <img
                                alt="Employee profile image"
                                className="rounded-full"
                                height="96"
                                src={im}
                                style={{
                                    aspectRatio: "96/96",
                                    objectFit: "cover",
                                }}
                                width="96"
                            />
                            <div className="text-sm text-gray-500 dark:text-gray-400">{message}</div>
                           
                        </div>
                    </div>
                </div>
            </div>
            {time > 0 && <p className="text-center text-gray-500 dark:text-gray-400">Going back in {time} seconds</p>}
        </div>
    );
}
