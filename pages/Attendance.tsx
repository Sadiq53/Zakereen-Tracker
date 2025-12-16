import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Member, Session, AttendanceRecord, AttendanceStatus } from '../types';
import { getMembers, getSessions, getSessionAttendance, saveAttendance } from '../services/storage';
import { Check, Search } from 'lucide-react';

const Attendance: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<Session | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!sessionId) return;
    const s = getSessions().find(s => s.id === sessionId);
    if (!s) {
      navigate('/sessions'); 
      return;
    }
    setSession(s);
    setMembers(getMembers().filter(m => m.isActive)); // Only active members
    setRecords(getSessionAttendance(sessionId));
  }, [sessionId, navigate]);

  const toggleAttendance = (memberId: string) => {
    if (!sessionId) return;
    
    // Check current status
    const existingRecord = records.find(r => r.memberId === memberId);
    const newStatus = existingRecord && existingRecord.status === AttendanceStatus.PRESENT 
      ? AttendanceStatus.ABSENT 
      : AttendanceStatus.PRESENT;

    const newRecord: AttendanceRecord = {
      id: existingRecord?.id || crypto.randomUUID(),
      sessionId,
      memberId,
      status: newStatus,
      timestamp: Date.now()
    };

    // Optimistic Update
    saveAttendance(newRecord);
    
    setRecords(prev => {
      const idx = prev.findIndex(r => r.memberId === memberId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newRecord;
        return copy;
      }
      return [...prev, newRecord];
    });
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.surname.toLowerCase().includes(search.toLowerCase()) ||
      m.itsNumber.includes(search)
    );
  }, [members, search]);

  const stats = useMemo(() => {
    const present = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const total = members.length;
    return { present, total, percent: total > 0 ? Math.round((present/total)*100) : 0 };
  }, [records, members]);

  if (!session) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header title="Mark Attendance" showBack />
      
      {/* Session Info Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center shadow-sm z-30">
        <div>
          <h2 className="font-bold text-gray-900">{session.name}</h2>
          <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{stats.present}</span>
          <span className="text-sm text-gray-400">/{stats.total}</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Filter members..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border-none shadow-sm focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start pb-24">
        {filteredMembers.map(member => {
          const isPresent = records.find(r => r.memberId === member.id)?.status === AttendanceStatus.PRESENT;
          
          return (
            <button
              key={member.id}
              onClick={() => toggleAttendance(member.id)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                ${isPresent 
                  ? 'bg-green-50 border-green-500 shadow-sm' 
                  : 'bg-white border-transparent shadow-sm hover:bg-gray-50'
                }
              `}
            >
              {isPresent && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm animate-in zoom-in">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
              
              <img 
                src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.firstName}+${member.surname}&background=random`} 
                alt={member.firstName}
                className={`w-16 h-16 rounded-full object-cover mb-2 border-2 ${isPresent ? 'border-green-500' : 'border-gray-100'}`}
              />
              
              <h3 className={`font-bold text-sm truncate w-full text-center ${isPresent ? 'text-green-800' : 'text-gray-900'}`}>
                {member.firstName}
              </h3>
              <p className="text-xs text-gray-500 truncate">{member.surname}</p>
              <p className="text-[10px] text-gray-400 mt-1">{member.itsNumber}</p>
            </button>
          );
        })}
      </div>

      {/* Floating Save/Done Button (Visual only as save is instant, but provides closure) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => navigate('/sessions')}
          className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold shadow-lg active:scale-95 transition-transform"
        >
          Done Marking
        </button>
      </div>
    </div>
  );
};

export default Attendance;