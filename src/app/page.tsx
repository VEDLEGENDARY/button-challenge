'use client';

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
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

      if (error) {
        console.error("Error fetching click count:", error);
      }

      if (data) {
        setClickCount(data.count);
      }
    };

    fetchClickCount();

    // Auto-update the click count every second
    const intervalId = setInterval(fetchClickCount, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Handle button click
  const handleClick = async () => {
    try {
      // Call the RPC function to increment the count
      const { error } = await supabase.rpc('increment_click_count');

      if (error) {
        console.error("Error incrementing click count:", error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="py-28 flex flex-col items-center min-h-screen bg-slate-800">
      <div className="flex flex-col justify-start items-center">
        <div className="w-1/3">
        </div>
        <button 
          onContextMenu={(e) => e.preventDefault()} 
          onClick={handleClick}
          className="text-white text-6xl font-semibold select-none tracking-normal bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg p-10 pt-7 pb-7 m-10"
          style={{ userSelect: "none", WebkitUserSelect: "none", msUserSelect: "none" }}
          draggable={false}>
          Click Me
        </button>
        <p className="text-3xl text-white">Current Click Count: {clickCount}</p>
      </div>
    </div>
  );
};

export default Page;
