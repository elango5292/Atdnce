import React from "react";
import { useState } from "react";
import { auth } from "./firebase.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login()
{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notice, setNotice] = useState("");

    const loginWithUsernameAndPassword = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch {
            setNotice("You entered a wrong username or password.");
        }
    }

    return(<>
    <div className="flex flex-col  items-center justify-center ">
   <> <h1 className="mb-[100px]">Login with your credentials.....</h1></>
    <div  className="w-screen h-3/4 flex flex-row gap-y-4  items-center px-[200px]">
<div className=" shadow-[#1b1b1b] w-1/2  flex flex-col gap-y-4 items-center justify-center border-[#2f2f2f]   border-[2px] shadow-lg rounded-xl py-9 px-5">
    <h1 className="text-sm font-xs">Enter details</h1>
    <div className = "form-floating mb-3">
    <label htmlFor = "exampleInputEmail1" className = "form-label mx-2 font-semibold text-lg">Email address</label>
                        <input type = "email" className = "form-control px-2 py-2 rounded-md text-[14px] w-[200px]  border-[#2f2f2f]  border-[2px] bg-[#292929] mb-3" id = "exampleInputEmail1" aria-describedby = "emailHelp" placeholder = "name@example.com" value = { email } onChange = { (e) => setEmail(e.target.value) }></input>
                       
                    </div>
                    <div className = "form-floating mb-3">
                    <label htmlFor = "exampleInputPassword1" className = "form-label mx-2 font-semibold text-lg">Password</label>
                        <input type = "password" className = "form-control px-2 py-2 rounded-md text-[14px] w-[200px]  border-[#2f2f2f]  border-[2px] bg-[#292929] mb-3" id = "exampleInputPassword1" placeholder = "Password" value = { password } onChange = { (e) => setPassword(e.target.value) }></input>
                       
                    </div>
                    { "" !== notice &&
                        <div className = "alert alert-warning" role = "alert">
                            { notice }    
                        </div>
                    } 
                    <div className = "d-grid">
                        <button type = "submit" className = "btn bg-[#2c2c2c] btn-primary pt-3 pb-3" onClick = {(e) => loginWithUsernameAndPassword(e)}>Submit</button>
                    </div>

</div>
<div>
    <img src="/login.svg" className = "w-auto h-[300px] grayscale"></img>
</div>
</div>
</div>
        </>
    )
}
