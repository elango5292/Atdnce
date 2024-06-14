import React, { useState, useEffect } from 'react';

export default function Toast ({ heading, message, type = 'info', duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timerId); 
  }, [duration]);

  const toastClasses = `
    fixed bottom-4 right-4 px-4 py-3 rounded-md
    shadow-md transition duration-300 ease-in-out
    ${type === 'info' ? 'bg-blue-500 text-white' : ''}
    ${type === 'success' ? 'bg-green-500 text-white' : ''}
    ${type === 'warning' ? 'bg-yellow-500 text-white' : ''}
    ${type === 'error' ? 'bg-red-500 text-white' : ''}
    ${isVisible ? 'opacity-100 z-50' : 'opacity-0 z-0'}
  `;

  return (
    <div className={toastClasses}>
      {heading && <h3>{heading}</h3>}
      <p>{message}</p>
    </div>
  );
};

