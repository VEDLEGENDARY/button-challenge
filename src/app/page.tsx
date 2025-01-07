'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fdcegkbfklelrthizulq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkY2Vna2Jma2xlbHJ0aGl6dWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMTY2MjcsImV4cCI6MjA1MTY5MjYyN30.G-WipPqT8qZla6T6tMW7t49ofqx1Wn3dxhMMY_Z3wGA'
);

const Page = () => {
  const [clickCount, setClickCount] = useState<number>(0);

  useEffect(() => {
    const fetchClickCount = async () => {
      const { data } = await supabase.from('clicks').select('count').single();
      if (data) {
        setClickCount(data.count);
      }
    };

    fetchClickCount();

    const interval = setInterval(fetchClickCount, 1000); // Auto-update count every second
    return () => clearInterval(interval);
  }, []);

  const handleIncrement = async () => {
    await supabase.rpc('increment_click_count'); // No need to assign `error` if not used
  };

  const handleDecrement = async () => {
    await supabase.rpc('decrement_click_count'); // No need to assign `error` if not used
  };

  return (
    <div className="py-28 flex flex-col items-center min-h-screen bg-slate-800">
      <div className="flex flex-col justify-start items-center">
        <p className="text-3xl text-white">World Click Count</p>

        <div className="flex flex-row">
          <p className="text-7xl text-white pt-5 pb-10">
            {clickCount.toLocaleString()} {/* Format count with commas */}
          </p>
          <p className="text-7xl text-white pt-5 pb-10">&nbsp;/&nbsp;1,000,000</p>
        </div>

        <div className="flex md:flex-row sm:flex-col justify-start items-center">
          <button
            onClick={handleIncrement}
            className="text-white text-6xl font-semibold select-none tracking-normal bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg p-20 pt-7 pb-7 m-10"
          >
            ADD
          </button>
          <button
            onClick={handleDecrement}
            className="text-white text-6xl font-semibold select-none tracking-normal bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg p-10 pt-7 pb-7 m-10"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
