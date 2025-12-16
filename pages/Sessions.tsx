import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Session } from '../types';
import { getSessions, deleteSession, saveSession } from '../services/storage';
import { Plus, MapPin, Calendar, Clock, Trash2, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // New Session Form State
  const [newSession, setNewSession] = useState<Partial<Session>>({
    name: '',
    location: 'Main Hall',
    date: new Date().toISOString().split('T')[0],
    startTime: '19:00',
    endTime: '21:00',
    notes: ''
  });

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.name || !newSession.date) return;

    const session: Session = {
      id: crypto.randomUUID(),
      name: newSession.name!,
      location: newSession.location || '',
      date: newSession.date!,
      startTime: newSession.startTime!,
      endTime: newSession.endTime!,
      notes: newSession.notes,
      createdAt: Date.now()
    };

    saveSession(session);
    setSessions(getSessions());
    setShowModal(false);
    // Reset form
    setNewSession({
       name: '',
       location: 'Main Hall',
       date: new Date().toISOString().split('T')[0],
       startTime: '19:00',
       endTime: '21:00',
       notes: ''
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Critical: Stop event from reaching the card's onClick
    
    if(window.confirm('Are you sure you want to delete this session? All attendance records for this session will be lost.')) {
      deleteSession(id);
      // Immediately update local state to reflect change without reload
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="relative min-h-full">
      <Header title="Sessions" />

      <div className="px-5 space-y-4 pb-32 pt-4">
        {sessions.length > 0 ? (
          sessions.map(session => (
            <div 
              key={session.id} 
              onClick={() => navigate(`/attendance/${session.id}`)}
              className="bg-surface p-5 rounded-2xl shadow-soft border border-transparent hover:border-blue-100 active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="font-bold text-gray-900 text-lg">{session.name}</h3>
                <button 
                    type="button"
                    onClick={(e) => handleDelete(e, session.id)} 
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-3 -m-2 rounded-full transition-colors relative z-30"
                    title="Delete Session"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 relative z-10">
                 <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                   <Calendar size={14} className="text-gray-400" />
                   <span className="font-medium text-gray-600">{new Date(session.date).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                   <Clock size={14} className="text-gray-400" />
                   <span className="font-medium text-gray-600">{session.startTime}</span>
                 </div>
              </div>

               <div className="flex items-center justify-between mt-2 relative z-10">
                 <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                   <MapPin size={14} />
                   <span>{session.location}</span>
                 </div>
                 <div className="flex items-center text-primary font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    Mark Attendance <ArrowRight size={16} className="ml-1" />
                 </div>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 text-gray-400">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Calendar size={32} className="opacity-40" />
            </div>
            <p className="font-medium">No sessions scheduled.</p>
            <p className="text-sm opacity-60">Tap + to create a new session.</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-[20px] shadow-glow shadow-blue-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-4 border-white/20 backdrop-blur-sm"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {/* Modal for Creation */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-900">New Session</h2>
                 <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                    <X size={20} />
                 </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 pb-20 sm:pb-8">
              <Input
                label="Session Name" 
                placeholder="e.g. Weekly Gathering" 
                value={newSession.name} 
                onChange={e => setNewSession({...newSession, name: e.target.value})} 
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                   label="Date"
                   type="date" 
                   value={newSession.date} 
                   onChange={e => setNewSession({...newSession, date: e.target.value})} 
                   required 
                />
                 <Input
                   label="Time"
                   type="time" 
                   value={newSession.startTime} 
                   onChange={e => setNewSession({...newSession, startTime: e.target.value})} 
                   required 
                />
              </div>

              <Input 
                label="Location"
                placeholder="e.g. Main Hall"
                value={newSession.location} 
                onChange={e => setNewSession({...newSession, location: e.target.value})} 
              />
              
              <div className="pt-4 flex gap-3">
                <button 
                    type="submit" 
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                >
                    Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;