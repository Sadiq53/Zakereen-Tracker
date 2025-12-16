import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getMembers, getAttendance, getSessions } from '../services/storage';
import { AttendanceStatus } from '../types';
import { Edit2, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const MemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const member = getMembers().find(m => m.id === id);
  const allAttendance = getAttendance().filter(a => a.memberId === id);
  const sessions = getSessions();

  const stats = useMemo(() => {
    const total = sessions.length;
    const attendedCount = allAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
    
    // LOGIC UPDATE: Missed is implicit. Total Sessions - Present = Missed.
    // This assumes the member should have attended all sessions.
    const missedCount = Math.max(0, total - attendedCount);
    
    const rate = total > 0 ? Math.round((attendedCount / total) * 100) : 0;
    
    return { total, attendedCount, missedCount, rate };
  }, [allAttendance, sessions]);

  if (!member) return <div className="p-10 text-center">Member not found</div>;

  const chartData = [
    { name: 'Present', value: stats.attendedCount, color: '#10b981' },
    { name: 'Missed', value: stats.missedCount, color: '#f1f5f9' },
  ];
  
  // Empty state handling
  if (stats.attendedCount === 0 && stats.missedCount === 0) {
      chartData[0] = { name: 'None', value: 1, color: '#f1f5f9' };
      chartData.pop();
  }

  // Determine header color based on house
  const getHeaderColor = (house: string) => {
    switch(house?.toLowerCase()) {
      case 'red': return 'bg-rose-500 shadow-rose-500/30';
      case 'green': return 'bg-emerald-500 shadow-emerald-500/30';
      case 'yellow': return 'bg-amber-500 shadow-amber-500/30';
      case 'blue': return 'bg-blue-500 shadow-blue-500/30';
      default: return 'bg-primary shadow-blue-500/30';
    }
  };

  const headerClass = getHeaderColor(member.houseColor);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Custom Header with Transparent Background Effect */}
      <div className={`relative pb-24 pt-4 px-4 text-white rounded-b-[2.5rem] shadow-lg transition-colors duration-300 ${headerClass}`}>
        <div className="flex justify-between items-center mb-6">
           <button onClick={() => navigate('/members')} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <ArrowLeft size={20} />
           </button>
           <button onClick={() => navigate(`/members/edit/${member.id}`)} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Edit2 size={20} />
           </button>
        </div>
        
        <div className="flex flex-col items-center">
           <div className="relative mb-3">
              <img 
                src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.firstName}+${member.surname}&size=128`} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl object-cover"
              />
              <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${member.isActive ? 'bg-success' : 'bg-gray-300'}`} />
           </div>
           <h2 className="text-2xl font-bold">{member.firstName} {member.surname}</h2>
           <p className="text-white/90 font-medium mt-1 opacity-90">ITS: {member.itsNumber}</p>
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-5 relative z-10">
        
        {/* Quick Stats Row */}
        <div className="bg-surface rounded-2xl p-4 shadow-soft flex justify-around items-center divide-x divide-gray-100">
           <div className="text-center px-4">
              <span className="block text-2xl font-bold text-gray-800">{member.grade || '-'}</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Grade</span>
           </div>
           <div className="text-center px-4">
              <span className="block text-2xl font-bold text-primary">{stats.rate}%</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Attend</span>
           </div>
           <div className="text-center px-4">
              <div 
                className="w-6 h-6 rounded-full mx-auto mb-1 border-2 border-white shadow-sm" 
                style={{ backgroundColor: member.houseColor ? member.houseColor.toLowerCase() : 'gray' }} 
              />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{member.houseColor}</span>
           </div>
        </div>

        {/* Contact Info */}
        <div className="bg-surface rounded-2xl p-5 shadow-soft space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Details</h3>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
               <Phone size={18} />
             </div>
             <div>
               <p className="text-xs text-gray-400 font-medium">Mobile</p>
               <p className="text-sm font-semibold text-gray-800">{member.mobileNumber || 'N/A'}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
               <MapPin size={18} />
             </div>
             <div>
               <p className="text-xs text-gray-400 font-medium">Address</p>
               <p className="text-sm font-semibold text-gray-800">{member.address || 'N/A'}</p>
             </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-surface rounded-2xl shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
             <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-lg">Last 5</span>
          </div>
          <div className="divide-y divide-gray-50">
            {sessions.length > 0 ? sessions.slice(0, 5).map(session => {
               const record = allAttendance.find(a => a.sessionId === session.id);
               const isPresent = record?.status === AttendanceStatus.PRESENT;
               
               return (
                 <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className={`w-2 h-2 rounded-full ${isPresent ? 'bg-success' : 'bg-gray-200'}`} />
                     <div>
                        <p className="text-sm font-bold text-gray-800">{session.name}</p>
                        <p className="text-xs text-gray-400">{new Date(session.date).toLocaleDateString()}</p>
                     </div>
                   </div>
                   {isPresent ? (
                     <span className="text-xs font-bold text-success bg-green-50 px-2 py-1 rounded border border-green-100">Present</span>
                   ) : (
                     <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">Absent</span>
                   )}
                 </div>
               )
            }) : (
              <div className="p-8 text-center text-gray-300 text-sm">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;