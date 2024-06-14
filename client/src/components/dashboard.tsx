import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import Addemp from "./addemp";
import Addsession from "./addsession";
import { CalendarPlus2, FileClock, Focus, UserRoundPlus } from 'lucide-react';
import { serverUrl } from '../constants';
import { auth } from "./firebase.ts";
export default function Dashboard(){
    const [data,setData] = useState()
    const [date,setDate] = useState(new Date())
    const [session,setSession] = useState(1)
    const [state,setState] = useState("newSession")
    useEffect(
        
        ()=>{
           
        let reqdata = JSON.stringify({
            "date":new Date(date),
            "sessionNumber":session
          });
          console.log(reqdata)
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: serverUrl+'/api/v1/admin/getAttendanceLogs',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : reqdata
          };
        
          
          axios.request(config)
          .then((response) => {
            setData(response.data.attendanceLogs)
            console.log(response.data.attendanceLogs);
          })
          .catch((error) => {
            console.log(error);
          });

       },[date,session]
    )
    return(
       <>
       <div className="flex flex-col h-screen my-2 mx-2 from-[#111] to-[#000000]">
       
        <div className="flex flex-row gap-x-2 p-2 justify-end mx-2">
<button className={`flex flex-row items-center text-[#cdcdcd] text-xs ${state==="addemp"?" border-[1px] border-[#868585] shadow-md shadow-[#484848]":""}`} onClick={()=>setState("addemp")}><span className="mr-2"><UserRoundPlus/></span>Add Employee</button>
<button  className={`flex flex-row items-center text-[#cdcdcd] text-xs ${state==="dash"?" border-[1px] border-[#868585] shadow-md shadow-[#484848]":""}`} onClick={()=>setState("dash")}><span className="mr-2"><FileClock/></span>Attendance Log</button>
<button   className={`flex flex-row items-center text-[#cdcdcd] text-xs ${state==="newSession"?" border-[1px] border-[#868585] shadow-md shadow-[#484848]":""}`} onClick={()=>setState("newSession")}><span className="mr-2"><CalendarPlus2/></span>Add Session</button>
<button   ><a href="/" className="flex flex-row items-center"><span className="mr-2 "><Focus/></span>Home</a></button>
        </div>
        {state!=="dash" ?(state==="newSession") ? <Addsession /> : <Addemp setstate={undefined} setim={undefined} setreason={undefined}/> :
        <div className="flex flex-col">
          <div className="flex flex-row gap-x-4 py-2 items-center">
            <div className="p-2">
                <input type="date" className="px-2 py-2 rounded-md border-[#2f2f2f]  border-[2px] bg-[#212121]" onChange={(e)=>setDate(e.target.value)}/>

            </div>
            <div>

        <label className='text-[#f0f0f0] mr-1 font-semibold text-[14px] mb-3'>Session:</label>
        <select className='px-2 py-2 rounded-md  w-[150px] text-[14px] border-[#2f2f2f]  border-[2px] bg-[#292929] mb-3' value={session} onChange={(e) => setSession(parseInt(e.target.value))}>
            <option value={1}>Forenoon</option>
            <option value={2}>Afternoon</option>
            <option value={3}>Night</option>
        </select>
        </div></div>

        <div className="my-2" >
      <table className="w-screen ">
        <thead >
          <tr className="px-2 py-2 rounded-md text-left border-[#2f2f2f]  border-[2px] bg-[#212121]" >
            <th >Employee ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Attendance </th>
          </tr>
        </thead>
        <tbody>
          {data&&data.map((item) => (
            <tr className=" w-screen border-b-[1px] border-[#676767]" key={item.employeeId}>
              <td className="">{item.employeeId} </td>
              <td>{item.name}</td>
              <td>{item.gender}</td>
              <td>{item.status}</td>
            </tr>
          ))}
          {data&&data.length === 0 && <tr className=" w-screen border-b-[1px]  border-[#414141]"><td colSpan={4} className="text-center py-6 text-xl font-black">No records found!</td></tr>}
        </tbody>
      </table>
    </div></div>}
       
    </div>
       </>
    )
}
