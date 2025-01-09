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
    await supabase.rpc('increment_click_count');
  };

  const handleDecrement = async () => {
    await supabase.rpc('decrement_click_count');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-800 py-28">
      <p className="text-3xl text-white">World Click Count</p>

      <div className="sm:flex-col md:flex-row">
        <p className="pb-5 pt-5 text-center text-7xl text-white">
          {clickCount.toLocaleString()}
        </p>
        <p className="pb-5 text-center text-4xl text-white">OUT OF</p>
        <p className="pb-10 text-center text-5xl text-white">1,000,000</p>
      </div>

      <div className="flex items-center justify-start sm:flex-col md:flex-row">
        <button
          onClick={handleIncrement}
          className="m-10 mb-0 w-full select-none rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 p-20 pb-7 pt-7 text-5xl font-semibold tracking-normal text-white sm:w-3/4"
        >
          ADD
        </button>
        <button
          onClick={handleDecrement}
          className="m-10 mb-0 w-full select-none rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 p-10 pb-7 pt-7 text-5xl font-semibold tracking-normal text-white sm:w-3/4"
        >
          REMOVE
        </button>
      </div>

      <div className="flex flex-col items-center pt-16 ml-6 mr-6 text-center">
        <p className="text-3xl text-white">IP Based Username</p>
        <p className="text-sm text-white">
          We never sell your data or share any IP address with anyone.<br />
          The purpose of storing your IP addresses is solely for your &quot;Username&quot;.
        </p>
        <div className="flex flex-col items-center p-3">
          <input
            type="text"
            className="m-5 w-full rounded-lg bg-slate-700 p-2 pl-3 pr-2 font-sans text-white"
            placeholder="Username (Max 10 characters)"
            disabled
          />
          <button
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-base font-normal text-white hover:bg-blue-800 sm:w-auto"
            disabled
          >
            Submit
          </button>
        </div>
      </div>

      <p className="flex flex-col items-center pb-3 pt-14 text-center text-3xl text-white">
        Leaderboard
      </p>

      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Clicks</th>
              <th scope="col" className="px-6 py-3">Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                User1
              </th>
              <td className="px-6 py-4">500,000</td>
              <td className="px-6 py-4">1</td>
            </tr>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                User2
              </th>
              <td className="px-6 py-4">450,000</td>
              <td className="px-6 py-4">2</td>
            </tr>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                User3
              </th>
              <td className="px-6 py-4">400,000</td>
              <td className="px-6 py-4">3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
