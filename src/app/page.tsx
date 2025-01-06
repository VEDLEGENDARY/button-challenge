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

  // Fetch initial click count and set up live updates
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

    // Auto-update click count every second
    const interval = setInterval(fetchClickCount, 1000);
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  // Handle click
  const handleClick = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('clicks')
        .select('count')
        .single();
      if (fetchError) throw new Error(fetchError.message);

      if (data) {
        const currentCount = data.count;
        const newCount = currentCount + 1;

        const { error: updateError } = await supabase
          .from('clicks')
          .upsert({ id: 1, count: newCount }, { onConflict: 'id' });
        if (updateError) throw new Error(updateError.message);

        setClickCount(newCount);
      }
    } catch (error) {
      console.error("Error updating click count:", error);
    }
  };

  return (
    <div className="py-28 flex flex-col items-center min-h-screen bg-slate-800">
      <div className="flex flex-col justify-start items-center">
        <p className="text-3xl text-white mb-6">Current Click Count: {clickCount}</p>
        <Button
          onClick={handleClick}
          className="text-6xl tracking-normal font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg p-10 pt-7 pb-7 m-10 text-white hover:opacity-90">
          Click Me
        </Button>
      </div>
    </div>
  );
};

// Custom Button component (Optional)
const Button = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className: string;
}) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Page;
