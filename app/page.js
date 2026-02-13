'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { Sparkles, MapPin, Calendar, Clock, Camera, Check, Copy, LayoutDashboard } from 'lucide-react';

export default function CreateEvent() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await imageCompression(file, { maxSizeMB: 0.5 });
      setFormData({ ...formData, file: compressed });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 999);
    let photo_url = null;

    if (formData.file) {
      const { data } = await supabase.storage.from('invites').upload(`${Date.now()}-${slug}`, formData.file);
      if (data) photo_url = supabase.storage.from('invites').getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase.from('events').insert([{
      title: formData.title, hosts: formData.hosts, datetime: formData.datetime,
      venue_name: formData.venue_name, venue_map_link: formData.venue_map_link,
      message: formData.message, slug, photo_url
    }]);

    if (!error) setSuccess({ link: `${window.location.origin}/i/${slug}`, dash: `${window.location.origin}/i/${slug}/guests` });
    else alert(error.message);
    setLoading(false);
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="app-container bg-white p-8 rounded-[2.5rem] shadow-xl text-center border border-slate-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><Check /></div>
        <h2 className="text-2xl font-black mb-6 text-slate-900">Invite is Live!</h2>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Guest Invite Link</p>
            <p className="text-violet-600 font-bold truncate text-sm mb-2">{success.link}</p>
            <button onClick={() => {navigator.clipboard.writeText(success.link); alert("Copied!")}} className="text-xs font-bold text-slate-500 hover:text-violet-600 flex items-center justify-center gap-1 mx-auto"><Copy size={12}/> Copy Link</button>
          </div>
          <a href={success.dash} className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg"><LayoutDashboard size={18}/> Track Guest Responses</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 bg-slate-50">
      <div className="app-container">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">LiteInvite</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">Create & Share Beautiful Invitations</p>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">by Srijen Gupta</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 shadow-2xl space-y-6 border border-white">
          <section className="space-y-4">
            <input required placeholder="Event Name (e.g. Birthday Party)" onChange={e => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Host Name (e.g. Srijen)" onChange={e => setFormData({...formData, hosts: e.target.value})} />
          </section>
          <section className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 flex items-center gap-1"><Clock size={12}/> Date & Time</label>
              <input required type="datetime-local" onChange={e => setFormData({...formData, datetime: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 flex items-center gap-1"><MapPin size={12}/> Location</label>
              <input required placeholder="Venue Name" className="mb-2" onChange={e => setFormData({...formData, venue_name: e.target.value})} />
              <input placeholder="Google Maps Link (Optional)" onChange={e => setFormData({...formData, venue_map_link: e.target.value})} />
            </div>
          </section>
          <textarea placeholder="Message for your guests..." rows="3" onChange={e => setFormData({...formData, message: e.target.value})} />
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:bg-slate-50 cursor-pointer transition-all">
            <Camera className="text-slate-300 mb-1" />
            <span className="text-xs font-bold text-slate-400">{formData.file ? "Photo Selected ✅" : "Add Cover Photo"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          <button disabled={loading} className="w-full bg-violet-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-violet-700 transition-all">
            {loading ? 'Creating Magic...' : 'Generate Invitation 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}