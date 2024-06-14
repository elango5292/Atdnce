import React, { useEffect } from 'react';
import { getDaysInMonth } from 'date-fns'; 
import { serverUrl } from '../constants';
import { toast ,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];


 function processSessions(data) {
    let result = {};
    for(let i = 0; i < data.length; i++) {
        let date = new Date(data[i].date);
        let day = date.getDate();
        if(result[day]) {
            result[day].push(data[i].sessionNumber);
            result[day].sort((a, b) => a - b); 
        } else {
            result[day] = [data[i].sessionNumber];
        }
    }
    return result;
}


const Calendar = () => {

  const [sessions, setSessions] = React.useState({});
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());

  
  const [from, setFrom] = React.useState(new Date());
  const [to, setTo] = React.useState(new Date());
  const [sessionNumber, setSessionNumber] = React.useState(1);
  const [action , setAction] = React.useState("add");
  const notify = () => toast("Wow so easy!");

  useEffect(() => {
    console.log("from:",new Date(from).toISOString().slice(0, 24) + 'Z',"to:",to,"sessionNumber:",sessionNumber,"action:",action)

  }, [from, to, month, year, sessionNumber, action]);



  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const firstDayOfmonth = new Date(year, month - 1,  1);
  
useEffect(() => {
    calupdater(month,year)
   
    // setSessions(processSessions(result.data));
},[month,year])

function calupdater(month,year) {
    try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const raw = JSON.stringify({
          "month": month,
          "year": year
        });
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        
        fetch(serverUrl + "/api/v1/admin/getSessions", requestOptions)
          .then((response) => response.json())
          .then((result) => setSessions(processSessions(result["data"])))
          .catch((error) => console.error(error));
    } catch (error) {
        console.log(error)
    }
}
 
async function handleCreate() {
    toast.info("Processing ...")
    try {
        const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "from": new Date(from).toISOString().slice(0, 24) ,
  "to": new Date(to).toISOString().slice(0, 24) ,
  "sessionNumber": sessionNumber,
  "action": action
});
console.log(raw)

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(serverUrl + "/api/v1/admin/createSessions", requestOptions)
  .then((response) => response.json())
  .then((result) => {console.log(result);calupdater(month,year)
if(result.status === "success") {
    // notify()
    toast.success(result.message)
    ;}
  })
  .catch((error) => {console.error(error);toast.warning(error)});
    } catch (error) {
        console.log(error)
    }

}
  return (
    <div className='flex flex-row w-[98vw] justify-center gap-x-7 my-auto items-center'>
        <div className='w-[1/2] flex flex-col'>
        <h1 className='text-[#f0f0f0] text-[30px] grayscale mb-7 ml-2  font-bold'>📅 Manage Sessions </h1>
        <div className='flex flex-col gap-y-3 shadow-[#1b1b1b] border-[#2f2f2f] w-[40vw]  border-[2px] shadow-lg rounded-xl py-9 px-5'>

       
        

        <div className='flex flex-row items-center w-full justify-around gap-x-4'>
            <div>
        <label className='text-[#f0f0f0] text-[14px] font-semibold mb-3 mr-1'>From:</label>
        <input className=
        'px-2 py-2 rounded-md text-[14px] w-[200px]  border-[#2f2f2f]  border-[2px] bg-[#292929] mb-3' type="date"  onChange={(e) => setFrom(new Date(e.target.value))} />
</div><div>

        <label className='text-[#f0f0f0] mr-1 font-semibold text-[14px] mb-3'>To:</label>
        <input className=
        'px-2 py-2 rounded-md text-[14px]  w-[200px]   border-[#2f2f2f]  border-[2px] bg-[#292929] mb-3' type="date"  onChange={(e) => setTo(new Date(e.target.value))} /> 
        </div>
</div>

<div className='flex flex-row items-center w-full justify-start gap-x-8'> 
<div>

        <label className='text-[#f0f0f0] mr-1 font-semibold text-[14px] mb-3'>Session:</label>
        <select className='px-2 py-2 rounded-md  w-[150px] text-[14px] border-[#2f2f2f]  border-[2px] bg-[#292929] mb-3' value={sessionNumber} onChange={(e) => setSessionNumber(parseInt(e.target.value))}>
            <option value={1}>Forenoon</option>
            <option value={2}>Afternoon</option>
            <option value={3}>Night</option>
        </select>
        </div>


<div>

<label className='text-[#f0f0f0] mr-1 text-[14px] font-semibold mb-3'>Action:</label>
<select className='px-2 py-2 rounded-md text-[14px]  w-[100px]  border-[#2f2f2f]  border-[2px] bg-[#292929] mb-3' value={action} onChange={(e) => setAction(e.target.value)}>
    <option value={"add"}>Add</option>
    <option value={"delete"}>Delete</option>
   
</select>
</div>
</div>

<div>
    <button onClick={handleCreate} className='px-2 py-2 rounded-md text-[14px] font-bold text-[#232323] border-[#2f2f2f]  border-[2px] bg-[#dbdbdb] hover:bg-[#ffffff] mb-3' >Submit -&gt;</button>
</div>


        </div>
        <img className='w-[200px] grayscale h-auto mx-auto mt-9 opacity-50' src={'/time.svg'} alt="calendar" />
        </div>
        <div className='w-[1px] bg-[#2f2f2f] h-full mx-4'></div>
        
        <div className='flex flex-col w-[1/2] h-auto items-center gap-y-3'>
        <div className='flex flex-row w-full justify-between px-4'>



        <select className='px-2 py-2 rounded-md border-[#2f2f2f]  border-[2px] bg-[#212121]' value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
            {[...Array(12)].map((_, month) => (
                <option key={month} value={month + 1}>{new Date(2000, month).toLocaleString('default', { month: 'long' })}</option>
            ))}
        </select>



        <select className='px-2 py-2 rounded-md border-[#2f2f2f]  border-[2px] bg-[#212121]' value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
            {[...Array(51)].map((_, year) => (
                <option key={year} value={2000 + year}>{2000 + year}</option>
            ))}
        </select>

    
        </div>
    <div className="calendar flex flex-col  p-4 shadow-lg  shadow-[#1b1b1b] border-[#2f2f2f]  border-[2px] rounded-xl ">
        <div className='grid grid-cols-7 '>
            {daysOfWeek.map(day => <div className="day p-4 text-center bg-[#212121] rounded " key={day}>{day}</div>)}
            {[...Array(firstDayOfmonth.getDay())].map((_, day) => <div className="day  m-2  " key={day}></div>)}
           
            {[...Array(daysInMonth)].map((_, day) => {
        const date = new Date(year, month - 1, day + 1);
        const key = `${year}-${month}-${day + 1}`;
      
        
      
        return (
          <div className="day flex flex-col gap-y-2 justify-center items-center bg-[#212121] rounded-lg hover:bg-[#282828] p-4 border-[#2f2f2f]  border-[1px]" key={key}>
            {day + 1} 
            <div className='flex flex-row gap-1 h-3'>
                {sessions[day + 1]?.map((session) => (
                    
                    <>
                    {session===1 && (
                        <div className='h-3 w-1 rounded-md bg-[#4BFF7D] opacity-70'></div>
                    )}
                  {session===2 && (
                        <div className='h-3 w-1 rounded-md bg-[#FFCD4B] opacity-70'></div>
                    )}
                  
                 {session===3 && (
                        <div className='h-3 w-1 rounded-md bg-[#FF4B4B] opacity-70'></div>
                    )}
                 
                 </>
                ))}
               
            </div>
          </div>
        );
      })}
        </div>
      
    </div>
    <div className='flex flex-row gap-x-4 my-2'>
        <div className='flex text-[11px] flex-row items-center  gap-2'>
    <div className='h-3 w-1 rounded-md bg-[#4BFF7D] opacity-70'/>
    Forenoon
    </div>
    <div className='flex text-[11px] flex-row items-center  gap-2'>
    <div className='h-3 w-1 rounded-md bg-[#FFCD4B] opacity-70'/>
    Afternoon
    </div>
    <div className='flex text-[11px] flex-row items-center  gap-2'>
    <div className='h-3 w-1 rounded-md bg-[#FF4B4B] opacity-70'/>
    Night
    </div>
    </div>

    </div>
    <ToastContainer />
    </div>
  );
};

export default Calendar;
