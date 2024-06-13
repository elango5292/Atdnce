import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import Addemp from "./addemp";
import Addsession from "./addsession";
import { CalendarPlus2, FileClock, Focus, UserRoundPlus } from 'lucide-react';

export default function Dashboard(){
    const [data,setData] = useState()
    const [date,setDate] = useState()
    const [state,setState] = useState("dash")
    useEffect(
        
        ()=>{
            console.log(date)
        let reqdata = JSON.stringify({
            "date":date,
            "sessionNumber":1
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/v1/admin/getAttendanceLogs',
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

       },[date]
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
        {state!=="dash" ?(state==="newSession") ? <Addsession month={6} year={2024}/> : <Addemp/> :
        <div className="flex flex-col">
            <div className="p-2">
                <input type="date" onChange={(e)=>setDate(e.target.value)}/>

            </div>

        <div className="my-2" >
      <table className="w-screen ">
        <thead >
          <tr className="text-left my-2 px-1 bg-[#555]" >
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
        </tbody>
      </table>
    </div></div>}
       
    </div>
       </>
    )
}
