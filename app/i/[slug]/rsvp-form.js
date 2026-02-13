'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function RSVPForm({ slug }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitRSVP = async (isAttending) => {
    if (!name.trim()) {
      alert("Please enter your name first!");
      return;
    }

    setLoading(true);
    
    // Attempt to insert data
    const { error } = await supabase
      .from('rsvps')
      .insert([
        { 
          event_slug: slug, 
          guest_name: name.trim(), 
          attending: isAttending 
        }
      ]);

    if (error) {
      console.error("Supabase Error:", error.message);
      alert("Database Error: " + error.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-[1.5rem] border border-green-100 animate-in zoom-in duration-300">
        <p className="text-green-700 font-black text-xl mb-1">Response Sent! 🎉</p>
        <p className="text-green-600 text-sm">The host has been notified.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Your Full Name</label>
        <input 
          placeholder="e.g. Aditi Rao" 
          value={name} 
          disabled={loading}
          onChange={e => setName(e.target.value)} 
          className="text-center font-bold text-lg"
        />
      </div>

      <div className="flex gap-3">
        <button 
          disabled={loading}
          onClick={() => submitRSVP(true)} 
          className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? '...' : "Yes, I'm Coming"}
        </button>
        <button 
          disabled={loading}
          onClick={() => submitRSVP(false)} 
          className="flex-1 bg-white border border-slate-200 text-slate-400 py-4 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? '...' : "Can't Make It"}
        </button>
      </div>
    </div>
  );
}