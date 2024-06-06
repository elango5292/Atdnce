"use client"
import * as faceapi from 'face-api.js'
import React, { useState } from 'react'
// import { BASE_URL } from '@/constants'
import axios from 'axios'

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
              const base64data = reader.result;
              console.log(base64data);
                 try {
              const response = await fetch(`${BASE_URL}device/markPresent`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: base64data})                // JSON.stringify({ image: base64data, transactionId: '12345' })
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
    <div className="w-screen h-screen animate-in fade-in zoom-in  duration-500 bg-gradient-to-b flex flex-col justify-center from-[#000] to-[#111]">
        <p className="text-3xl font-bold bg-gradient-to-br from-[#d6d6d6] via-[#a8a8a8] to-[#d6d6d6] inline-block text-transparent bg-clip-text text-center">Mark your Attendence</p>
      <head>
        <title>Face Detection</title>
        <meta name="description" content="Face Detection" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      {
        captureVideo ?
          modelsLoaded ?
            <div >
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <video className={`border-4 ${multipleFaces?"border-[#e16565]":faceDetected?"border-[#76be6b] ":"border-[#e16565]"}`} ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
            </div>
            :
            <div>loading...</div>
          :
          <>
          </>
      }
      
      <p className='text-sm font-light p-2 text-[#b1b1b1] text-center'>{faceDetected ? (multipleFaces ? 'Multiple faces detected!' : 'All good') : 'No face detected'}</p>
      <button
  onClick={markAttendance} 
  className='h-auto w-auto mx-auto bg-gradient-to-b from-[#1a1a1a] to-[#1e1e1e]  rounded-[13px] bg-opacity-45 border hover:bg-[#181818] border-neutral-400 border-opacity-50 hover:shadow-[0_4px_15px_rgba(79,79,79,0.7)]'
>
  Mark attendance
</button>
  </div>
  )
}

export default Home