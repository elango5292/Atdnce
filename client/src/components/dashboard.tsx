import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import Addemp from "./addemp";

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
        <div className="flex flex-row gap-x-2 p-2">
<button className="" onClick={()=>setState("addemp")}>Add Employee</button>
<button onClick={()=>setState("dash")}>Attendance Log</button>
<button onClick={()=>setState("newSession")}>newSession</button>
<button ><a href="/">Home</a></button>
        </div>
        {state!=="dash" ? <Addemp/> :
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
