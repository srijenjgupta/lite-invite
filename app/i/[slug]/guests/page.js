'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Check, X, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function GuestDashboard({ params }) {
  const { slug } = use(params);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResponses = async () => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_slug', slug)
      .order('created_at', { ascending: false });
    
    if (error) console.error("Fetch error:", error.message);
    if (data) setGuests(data);
    setLoading(false);
  };

  useEffect(() => {
    if (slug) {
      fetchResponses();

      // Listen for NEW entries live
      const channel = supabase
        .channel('realtime-rsvps')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'rsvps', filter: `event_slug=eq.${slug}` }, 
          (payload) => {
            setGuests(prev => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [slug]);

  const attending = guests.filter(g => g.attending).length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-md">
        
        <Link href={`/i/${slug}`} className="text-slate-400 text-[10px] font-black uppercase flex items-center gap-1 mb-4 hover:text-violet-600 transition-colors">
          <ArrowLeft size={14} /> Back to Invitation
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black">Guest List</h1>
              <div className="text-right">
                <span className="text-3xl font-black text-green-400 block leading-none">{attending}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Confirmed</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3 min-h-[300px]">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300" /></div>
            ) : guests.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-300 font-bold italic">No responses yet...</p>
              </div>
            ) : (
              guests.map((guest) => (
                <div key={guest.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 duration-300">
                  <span className="font-bold text-slate-800">{guest.guest_name}</span>
                  {guest.attending ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                      <Check size={10} strokeWidth={4} /> Going
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                      <X size={10} strokeWidth={4} /> No
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}