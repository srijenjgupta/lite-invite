'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase'; 

export default function RSVPButtons({ eventSlug }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null); // 'yes', 'no', or 'done'

  const handleRSVP = async (attending) => {
    if (!name) return alert("Please enter your name first!");
    
    await supabase.from('rsvps').insert([
      { event_slug: eventSlug, guest_name: name, attending: attending }
    ]);
    setStatus('done');
  };

  if (status === 'done') return (
    <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
      <p className="text-green-700 font-bold text-lg">Thanks for responding! 🎉</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <input 
        placeholder="Enter your name to RSVP..." 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="text-center font-bold"
      />
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleRSVP(true)} className="bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
          Count Me In 🙋‍♂️
        </button>
        <button onClick={() => handleRSVP(false)} className="bg-white border border-slate-200 text-slate-500 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
          Can't Go 😢
        </button>
      </div>
    </div>
  );
}