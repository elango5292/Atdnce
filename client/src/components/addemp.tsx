"use client"
import * as faceapi from 'face-api.js'
import React, { useState } from 'react'
// import { BASE_URL } from '@/constants'
import axios from 'axios'
import { Hash, PersonStanding,StickyNote,User } from 'lucide-react'

const BASE_URL = "http://localhost:5555/api/"

const Home= ({setstate,setim,setreason}) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [multipleFaces, setMultipleFaces] = useState(false);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  //usestate for name gender,employee id and role

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [empid, setEmpid] = useState("");
  const [role, setRole] = useState("");

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true))
    }
    loadModels();
    startVideo();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current && !faceDetected) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current!);
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi.detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

        if (resizedDetections.length > 1) {
          setMultipleFaces(true);
        } else {
          setMultipleFaces(false);
        }

        if (resizedDetections.length > 0) {
          setFaceDetected(true);
        } else {
          setFaceDetected(false);
        }
      }
    }, 5000)
  }

  const markAttendance = async () => {
    if (videoRef.current && videoRef.current.readyState === 4 && multipleFaces === false) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
              const data = reader.result;
              const parts = data.split(",");

const base64data = parts[1];
              console.log(base64data);
                 try {
              const response = await fetch(`http://localhost:3000/api/v1/admin/createEmployee`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({employeeName:name,employeeId:empid,gender:gender,role:role, image: base64data})                // JSON.stringify({ image: base64data, transactionId: '12345' })
              });
              const data = await response.json();
              if (data.status=== "success") {
                setreason(data.data.message);
                setim(data.data.imgUrl);
                setstate(1);
                
              }
              console.log(data);
            //   console.log(base64data);
            } catch (error) {
              console.error('Error posting image:', error);
            }
            //   console.log(base64data);
            }
          }
        }, 'image/jpeg', 0.8);
      }
    }
  }


  return (
    <div className="w-[98vw] h-auto animate-in fade-in zoom-in  py-6 my-9    duration-500  flex flex-col justify-center items-center ">
     
<div   className='relative  flex flex-row justify-around w-[90vw] p-9  shadow-lg  shadow-[#1b1b1b] border-[#2f2f2f]  border-[1px] rounded-xl'>
<div className={`absolute z-20 top-0 left-0 h-full grayscale w-full bg-gradient-to-br from-[#1e1e1e]  to-[#2a2a2a] opacity-60`}></div>
  <div className={`absolute z-10 top-0 left-0 h-full grayscale w-full bg-[url('/texture.png')] bg-blend-luminosity opacity-10 blur-sm  `}></div>
<div className='w-auto  z-30 flex flex-col justify-center items-center  '>
<p className="text-xl font-black bg-gradient-to-br from-[#d6d6d6] via-[#a8a8a8] to-[#d6d6d6] inline-block text-transparent bg-clip-text  my-4">Add new employee</p>
   {/* get input for name gender role and employee id */}
   <div className='flex flex-row items-center gap-x-1 '>
   <span className='bg-[#1b1b1b] p-2 rounded-md border-[#4e4e4e]  border-[2px]'><User /></span>
   <input className='w-[350px] px-4 py-3 my-2 rounded-lg border-[1px] border-[#555555] text-[#d1d1d1] bg-[#202020] shadow-inner  shadow-[#323232] focus:outline-none focus:ring-2  focus:ring-[#a2a2a2] focus:border-transparent' placeholder='Name' type="text" value={name} onChange={(e)=>setName(e.target.value)} /> </div>
   <div className='flex flex-row items-center  gap-x-1 '>
   <span className='bg-[#1b1b1b] p-2 rounded-md border-[#4e4e4e]  border-[2px]'><PersonStanding/></span>
   <input className='w-[350px] px-4 py-3 my-2 rounded-lg border-[1px] border-[#555555] text-[#d1d1d1] bg-[#202020] shadow-inner  shadow-[#323232]  focus:outline-none focus:ring-2 focus:ring-[#a2a2a2] focus:border-transparent' placeholder='Gender' type="text" value={gender} onChange={(e)=>setGender(e.target.value)} /> </div>
   <div className='flex flex-row items-center  gap-x-1 '>
   <span className='bg-[#1b1b1b] p-2 rounded-md border-[#4e4e4e]  border-[2px]'><Hash/></span>
   <input className='w-[350px] px-4 py-3 my-2 rounded-lg border-[1px] border-[#555555] text-[#d1d1d1] bg-[#202020] shadow-inner  shadow-[#323232]  focus:outline-none focus:ring-2 focus:ring-[#a2a2a2] focus:border-transparent' placeholder='Emp ID' type="text" value={empid} onChange={(e)=>setEmpid(e.target.value)} /> </div>
   <div className='flex flex-row items-center  gap-x-1 '>
   <span className='bg-[#1b1b1b] p-2 rounded-md border-[#4e4e4e]  border-[2px]'><StickyNote/></span>
   <input className='w-[350px] px-4 py-3 my-2 rounded-lg border-[1px] border-[#555555] text-[#d1d1d1] bg-[#202020] shadow-inner  shadow-[#323232] focus:outline-none focus:ring-2 focus:ring-[#a2a2a2] focus:border-transparent' placeholder='Role' type="text" value={role} onChange={(e)=>setRole(e.target.value)} /> </div>
</div>

   <div className='flex flex-col  z-30'>
      {
        captureVideo ?
          modelsLoaded ?
            <div >
              <div  style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <video className={`border-t-4 ${multipleFaces?"border-[#ff0000]":faceDetected?"border-[#8DB600] ":"border-[#ff0000]"}`} ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
            </div>
            :
            <div>loading...</div>
          :
          <>
          </>
      }
      
      <p className="text-sm font-light p-2 text-gray-500 text-center">
  {faceDetected ? (
    multipleFaces ? 'Multiple faces detected!' :
      (name && gender && empid && role) ? 'All good' : 'Please fill in all required fields'
  ) : 'No face detected'}
</p>

      <button
  onClick={markAttendance} 
  className='h-auto w-auto mx-auto bg-gradient-to-b from-[#1a1a1a] to-[#1e1e1e]  rounded-[13px] bg-opacity-45 border hover:bg-[#181818] border-neutral-400 border-opacity-50 hover:shadow-[0_4px_15px_rgba(79,79,79,0.7)]'
>
  Add employee
</button>
</div>
  </div></div>
  )
}

export default Home