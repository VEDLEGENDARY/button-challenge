'use client';

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with provided URL and key
const supabase = createClient(
  'https://fdcegkbfklelrthizulq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkY2Vna2Jma2xlbHJ0aGl6dWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMTY2MjcsImV4cCI6MjA1MTY5MjYyN30.G-WipPqT8qZla6T6tMW7t49ofqx1Wn3dxhMMY_Z3wGA'
);

const Page = () => {
  const [clickCount, setClickCount] = useState<number>(0);

  // Fetch initial click count from Supabase
  useEffect(() => {
    const fetchClickCount = async () => {
      const { data, error } = await supabase
        .from('clicks')
        .select('count')
        .single();
      if (data) {
        setClickCount(data.count);
      }
    };
    
    fetchClickCount();
  }, []);

  // Handle click button click
  const handleClick = async () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Update click count in Supabase
    await supabase
      .from('clicks')
      .upsert(
        { id: 1, count: newCount }, 
        { onConflict: 'id' } // Ensure 'id' is specified as a string
      );
  };

  return (
    <div className="py-28 flex flex-col items-center min-h-screen bg-slate-800">
      <div className="flex flex-col justify-start items-center">
        <div className="w-1/3">
        </div>
        <p className="text-6xl tracking-normal font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg p-10 pt-7 pb-7 m-10">
          <button onClick={handleClick} className="text-white text-xl font-semibold">
            Click Me
          </button>
        </p>
        <p className="text-3xl text-white">Current Click Count: {clickCount}</p>
      </div>
    </div>
  );
};

export default Page;
