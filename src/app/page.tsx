'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fdcegkbfklelrthizulq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkY2Vna2Jma2xlbHJ0aGl6dWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMTY2MjcsImV4cCI6MjA1MTY5MjYyN30.G-WipPqT8qZla6T6tMW7t49ofqx1Wn3dxhMMY_Z3wGA'
);

const Page = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [userIP, setUserIP] = useState<string | null>(null);
  const [adds, setAdds] = useState<number>(0);
  const [removes, setRemoves] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [worldCount, setWorldCount] = useState<number>(0);

  useEffect(() => {
    // Fetch the user's IP and their adds/removes values
    const fetchUserData = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip;
        setUserIP(ip);

        const { data: existingUser, error: fetchError } = await supabase
          .from('userbase')
          .select('adds, removes')
          .eq('ip', ip)
          .limit(1);  // Fix to ensure single result

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching IP:', fetchError.message);
        } else if (existingUser && existingUser.length > 0) {
          setAdds(existingUser[0].adds);
          setRemoves(existingUser[0].removes);
        }
      } catch (err) {
        console.error('An error occurred while fetching IP:', err);
      }
    };

    fetchUserData();
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('userbase')
      .select('username, adds, removes')
      .order('adds', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching leaderboard:', error.message);
    } else {
      const leaderboardData = data.map((entry: any) => ({
        username: entry.username,
        adds: entry.adds,
        removes: entry.removes,
        totalClicks: entry.adds + entry.removes,
      }));

      setLeaderboard(leaderboardData);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWorldCount = async () => {
      const { data, error } = await supabase
        .from('userbase')
        .select('adds, removes');

      if (error) {
        console.error('Error fetching world count data:', error.message);
      } else {
        const totalAdds = data.reduce((sum: number, entry: any) => sum + entry.adds, 0);
        const totalRemoves = data.reduce((sum: number, entry: any) => sum + entry.removes, 0);
        setWorldCount(totalAdds - totalRemoves);
      }
    };

    fetchWorldCount();
    const interval = setInterval(fetchWorldCount, 100);
    return () => clearInterval(interval);
  }, []);

  const handleIncrement = async () => {
    setAdds(adds + 1);
    await supabase.rpc('increment_click_count');
    
    if (userIP) {
      const { data: user, error: userError } = await supabase
        .from('userbase')
        .select('adds')
        .eq('ip', userIP)
        .limit(1);  // Fix to ensure single result

      if (userError) {
        console.error('Error fetching user:', userError.message);
      } else if (user && user.length > 0) {
        const { error: updateError } = await supabase
          .from('userbase')
          .update({ adds: user[0].adds + 1 })
          .eq('ip', userIP);

        if (updateError) {
          console.error('Error updating adds count:', updateError.message);
        }
      }
    }
  };

  const handleDecrement = async () => {
    // Check if removes count is greater than 0 before decrementing
    if (removes < adds) {
      setRemoves(removes + 1);
      await supabase.rpc('decrement_click_count');
  
      if (userIP) {
        const { data: user, error: userError } = await supabase
          .from('userbase')
          .select('removes')
          .eq('ip', userIP)
          .limit(1);
  
        if (userError) {
          console.error('Error fetching user:', userError.message);
        } else if (user && user.length > 0) {
          const { error: updateError } = await supabase
            .from('userbase')
            .update({ removes: user[0].removes + 1 })
            .eq('ip', userIP);
  
          if (updateError) {
            console.error('Error updating removes count:', updateError.message);
          }
        }
      }
    } else {
      console.log('Cannot decrement removes count below 0');
    }
  };
  
  const saveUserIPAndUsername = async () => {
    if (username) {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip;
        setUserIP(ip);

        const { data: existingUser, error: fetchError } = await supabase
          .from('userbase')
          .select('*')
          .eq('ip', ip)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching IP:', fetchError.message);
        }

        if (existingUser) {
          const { data: updatedUser, error: updateError } = await supabase
            .from('userbase')
            .update({ username, adds, removes })
            .eq('ip', ip);

          if (updateError) {
            console.error('Error updating user:', updateError.message);
          } else {
            console.log('IP updated with new username:', updatedUser);
          }
        } else {
          const { data: newUser, error: insertError } = await supabase
            .from('userbase')
            .insert([{ ip, username, adds, removes }]);

          if (insertError) {
            console.error('Error inserting user:', insertError.message);
          } else {
            console.log('New user inserted with IP and username:', newUser);
          }
        }
      } catch (err) {
        console.error('An error occurred while fetching IP:', err);
      }
    } else {
      console.log("Username is required");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-800 py-28">
      <p className="text-7xl text-white">World Click Count</p>

      <div className="sm:flex-col md:flex-row">
        <p className="pb-5 pt-5 text-center text-7xl text-white">
          {worldCount.toLocaleString()}
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

      <div className="flex flex-col items-center p-3">
        <input
          type="text"
          className="m-5 w-full rounded-lg bg-slate-700 p-2 pl-3 pr-2 font-sans text-white"
          placeholder="Username (Max 10 characters)"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-base font-normal text-white hover:bg-blue-800 sm:w-auto"
          onClick={saveUserIPAndUsername}
          disabled={!username}
        >
          Submit
        </button>
      </div>

      <div className="mt-6 text-white text-2xl">Leaderboard</div>

      <div className="mt-6 rounded-lg bg-white shadow-md dark:bg-gray-800 dark:text-gray-400 w-3/4 md:w-1/2">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Adds</th>
              <th className="px-6 py-3">Removes</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={entry.username}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{entry.username}</td>
                <td className="px-6 py-4">{entry.adds}</td>
                <td className="px-6 py-4">{entry.removes}</td>
                <td className="px-6 py-4">{entry.totalClicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
