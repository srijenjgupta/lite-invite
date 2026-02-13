import { supabase } from '../../../lib/supabase';
import { Calendar, MapPin } from 'lucide-react';
import RSVPForm from './rsvp-form';

// --- FOR DYNAMIC PREVIEWS ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: event } = await supabase.from('events').select('title', 'hosts', 'photo_url').eq('slug', slug).single();

  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title} | LiteInvite`,
    description: `You are invited by ${event.hosts}! Click to view details and RSVP.`,
    openGraph: {
      title: event.title,
      description: `Hosted by ${event.hosts} - Click to see location and RSVP.`,
      images: event.photo_url ? [event.photo_url] : [],
    },
  };
}

export default async function InvitePage({ params }) {
  const { slug } = await params;
  
  // Fetch event details
  const { data: event } = await supabase.from('events').select('*').eq('slug', slug).single();

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">Event Not Found 😕</h1>
        <p className="text-sm mt-2">Please check the link and try again.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
        
        {/* Cover Photo */}
        {event.photo_url && (
          <div className="w-full h-56 bg-slate-200">
             <img src={event.photo_url} className="w-full h-full object-cover" alt="Event Cover" />
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{event.title}</h1>
            <p className="text-xs font-bold text-violet-600 tracking-widest uppercase">
              Hosted by {event.hosts}
            </p>
          </div>

          {/* Details Card */}
          <div className="space-y-6 mb-10">
            {/* Date Row (Time Removed) */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                <p className="font-bold text-slate-800 text-lg">
                  {new Date(event.datetime).toLocaleDateString([], { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Venue Row */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="font-bold text-slate-800 text-lg leading-snug">{event.venue_name}</p>
                {event.venue_map_link && (
                  <a href={event.venue_map_link} target="_blank" className="inline-block mt-1 text-xs font-bold text-violet-600 border-b border-violet-200 hover:text-violet-800 transition-colors">
                    View on Map &rarr;
                  </a>
                )}
              </div>
            </div>

            {/* Message Box */}
            {event.message && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-600 italic text-sm text-center leading-relaxed">
                "{event.message}"
              </div>
            )}
          </div>
          
          {/* RSVP Form (Interactive) */}
          <div className="border-t border-slate-100 pt-8">
            <RSVPForm slug={slug} />
          </div>

        </div>
      </div>
    </div>
  );
}
