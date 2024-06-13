import React from 'react';
import { getDaysInMonth } from 'date-fns'; // A utility function to get days in a month

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
let month=1
 let year=2022

const Calendar = () => {

  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const firstDayOfmonth = new Date(year, month - 1,  1);
  console.log("day",firstDayOfmonth.getDay())

  return (
    <div className="calendar flex flex-col w-[1/2] ">
        <div className='grid grid-cols-7'>
            {daysOfWeek.map(day => <div className="day" key={day}>{day}</div>)}
            {[...Array(firstDayOfmonth.getDay())].map((_, day) => <div className="day" key={day}></div>)}
           
            {[...Array(daysInMonth)].map((_, day) => {
        const date = new Date(year, month - 1, day + 1);
        const key = `${year}-${month}-${day + 1}`;
      
        
      
        return (
          <div className="day" key={key}>
            {day + 1} 
            
          </div>
        );
      })}
        </div>
      
    </div>
  );
};

export default Calendar;
