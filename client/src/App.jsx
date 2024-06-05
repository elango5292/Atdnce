"use client"

import Success from "./components/success.tsx";
import Failure from "./components/failed.tsx";
import Capture from "./components/default.tsx";
import { useState } from "react";

export default function Home() {
const [state, setState] = useState(0);
const [im, setIm] = useState("");
const [reason, setReason] = useState("");

// 0 - initial, 1 - success, 2 - failure
  return (
   <div>
    {state === 0 ? <div className="wrapper"><Capture setstate={setState} setim={setIm} setreason={setReason} state={state}/></div> : state === 1 ? <div className="wrapper"><Success setstate={setState} message={reason} im={im}/></div> : <div className="wrapper"><Failure/></div> }
   </div>
  )
} 