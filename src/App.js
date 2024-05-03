import logo from './logo.svg';
import './App.css';
import { useRef, useState } from 'react';
import { type } from '@testing-library/user-event/dist/type';

function App() {
const [recording,setRecording]= useState(false);
const [stream,setStream] = useState(null);
const[mediaRecorder , setMediaRecorder] = useState(null);
const videoRef = useRef()
const audioRef = useRef()

const startRecording = async()=>{
  try{
     
    const videoStream = await navigator.mediaDevices.getDisplayMedia({video: true})
    const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
   const combine = new MediaStream();
   [videoStream,audioStream].forEach(stream => {
    stream.getTracks().forEach(track => combine.addTrack(track))
   })
   const mediaRecorder = new MediaRecorder(combine);
   const recorderChunks = [];

   mediaRecorder.ondataavailable = (event) =>{
    if(event.data.size >0){
      recorderChunks.push(event.data)
    }
   }
   mediaRecorder.onstop=() =>{
    const blob = new Blob(recorderChunks,{type:'video/webm'})
    const url =URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display:none';
    a.href = url;
    a.download ='record.webm'
    a.click();
    window.URL.revokeObjectURL(url);
   }

   mediaRecorder.start();
   setRecording(true);
   setStream(combine);
   setMediaRecorder(mediaRecorder);
  
  }catch(error){
    console.error('Error',error)
  }
}
 const stopRecording =()=>{
  if(mediaRecorder){
    mediaRecorder.stop();
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setRecording(false)
  }

 }

  return (
    <div className="App">
      {recording ? (
      <button onClick={stopRecording}>Stop</button>
      ):(
      <button onClick={startRecording}>Start</button>
      )}
      <video controls ref={videoRef}></video>
     
    </div>
  );
}

export default App;
