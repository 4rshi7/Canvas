import React, { use, useCallback } from 'react'
import { TfiControlPlay } from "react-icons/tfi";
import { FaShapes } from "react-icons/fa";
import { IoIosText } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { BsFiletypePdf } from "react-icons/bs";
import { useNavigate } from 'react-router';
import { useState } from 'react';
import useCanvas from '../hooks/useCanvas.jsx';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/';

const Home = () => {
  const nav = useNavigate();

  const [width, setWidth] = useState("");
  const[height, setHeight] = useState("");

  const  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}canvas`, { 
        width: width, 
        height: height 
      });
      
      const newId = response.data.canvasId;
      console.log('Canvas Session Created:', newId);
      nav(`/canvas/${newId}`);
      
    } catch (error) {
      console.error('Failed to create session:', error);
      alert("Could not start session");
    } 
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-blue-200 p-8 rounded-lg shadow-lg  flex flex-col items-center w-[600px]'>
        <h1 className='text-2xl font-bold text-center'> Canvas</h1>
        <h2 className='text-lg mt-4 font-medium'>Express your ideas with canvas and export them in high quality pdfs </h2>
        <ul className='mt-4 flex  flex-col self-start mx-16'>
            <li className=' pl-2 flex items-center gap-1'> <FaShapes />Draw shapes </li>
            <li className='pl-2 flex items-center gap-1'><IoIosText />Add text </li>
            <li className=' pl-2 flex  items-center gap-1'><FaImages />Insert images </li>
            <li className=' pl-2 flex  items-center gap-1'><BsFiletypePdf />Export as high-quality PDFs </li>
        </ul>
        <form onSubmit={handleSubmit} className='flex flex-col mt-6 w-full'>
          <label className='mx-16'>Enter Dimensions :</label>
          <input required onChange={(e)=>{ setWidth(e.target.value)}} type="number" name="width" placeholder='Width' className='m-2 p-1 rounded-md  bg-white mx-16'/>
          <input  required onChange={(e)=>{ setHeight(e.target.value)}} type="number" name="height" placeholder='Height' className='m-2 p-1 rounded-md bg-white mx-16'/>
          <button  className=' cursor-pointer hover:bg-blue-700 mt-6 flex justify-center items-center gap-1 bg-blue-600 rounded-md px-4 py-2 text-white mx-16 ' >{<TfiControlPlay />}  Start building</button>
        </form>
        
        </div>
      </div>
    
  )
}

export default Home