import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import Header from '../components/Header';
import { getMembers, getSessions, getAttendance } from '../services/storage';
import { Users, Calendar, CheckCircle } from 'lucide-react';
import { AttendanceStatus } from '../types';

const Dashboard: React.FC = () => {
  const members = getMembers();
  const sessions = getSessions();
  const attendance = getAttendance();

  const analytics = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.isActive).length;
    const totalSessions = sessions.length;

    // Calculate overall attendance rate based on all sessions
    // Naive approach: Sum of all present records / (Total Sessions * Active Members) roughly
    // Better approach for "Overall Rate": Average of rates of all sessions
    const presentRecords = attendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const totalPossibleAttendance = totalSessions * activeMembers; 
    const overallRate = totalPossibleAttendance > 0 ? Math.round((presentRecords / totalPossibleAttendance) * 100) : 0;

    // Last Session Stats
    const lastSession = sessions.length > 0 ? sessions[0] : null;
    let lastSessionRate = 0;
    let lastSessionPresent = 0;
    let lastSessionAbsent = 0;

    if (lastSession) {
      const lastSessionAttendance = attendance.filter(a => a.sessionId === lastSession.id);
      lastSessionPresent = lastSessionAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
      
      // LOGIC UPDATE: Absent = Total Active Members - Present
      // We assume anyone not marked present is absent for this session
      lastSessionAbsent = Math.max(0, activeMembers - lastSessionPresent);
      
      const divisor = activeMembers > 0 ? activeMembers : 1;
      lastSessionRate = Math.round((lastSessionPresent / divisor) * 100);
    }

    // Weekly Trends (Last 5 sessions)
    const recentSessions = sessions.slice(0, 5).reverse().map(session => {
      const recs = attendance.filter(a => a.sessionId === session.id);
      const present = recs.filter(a => a.status === AttendanceStatus.PRESENT).length;
      return {
        name: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: present,
      };
    });

    return {
      totalMembers,
      activeMembers,
      totalSessions,
      overallRate,
      lastSession,
      lastSessionRate,
      lastSessionPresent,
      lastSessionAbsent,
      recentSessions
    };
  }, [members, sessions, attendance]);

  const pieData = [
    { name: 'Present', value: analytics.lastSessionPresent, color: '#10b981' }, // Emerald 500
    { name: 'Absent', value: analytics.lastSessionAbsent, color: '#f1f5f9' },  // Slate 100 (Subtle for absent)
  ];

  const hasData = analytics.lastSessionPresent > 0 || analytics.lastSessionAbsent > 0;

  return (
    <div className="space-y-6 pb-6">
      <Header title="Dashboard" />
      
      <div className="px-5 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface p-5 rounded-2xl shadow-soft border border-white/60 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Users size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{analytics.activeMembers}</h3>
              <p className="text-sm text-gray-500 font-medium">Active Members</p>
            </div>
          </div>

          <div className="bg-surface p-5 rounded-2xl shadow-soft border border-white/60 flex flex-col justify-between h-32">
             <div className="flex justify-between items-start">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Calendar size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Sessions</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{analytics.totalSessions}</h3>
              <p className="text-sm text-gray-500 font-medium">Conducted</p>
            </div>
          </div>
        </div>

        {/* Overall Attendance Rate */}
        <div className="bg-surface p-6 rounded-2xl shadow-soft border border-white/60 flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Overall Avg. Attendance</p>
              <h3 className="text-4xl font-bold text-gray-900">{analytics.overallRate}%</h3>
           </div>
           <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                 <path className="text-green-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                 <path className="text-success" strokeDasharray={`${analytics.overallRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <CheckCircle className="text-success" size={28} />
           </div>
        </div>

        {/* Last Session Analytics */}
        <div className="bg-surface p-6 rounded-2xl shadow-soft border border-white/60">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Last Session</h3>
             {analytics.lastSession && (
               <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                 {new Date(analytics.lastSession.date).toLocaleDateString()}
               </span>
             )}
          </div>
          
          {analytics.lastSession ? (
            <div className="flex items-center">
              <div className="h-36 w-36 flex-shrink-0 relative">
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900">{analytics.lastSessionRate}%</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Present</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={6}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-8 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-success ring-4 ring-green-50" />
                     <span className="text-sm font-medium text-gray-600">Present</span>
                   </div>
                   <span className="text-lg font-bold text-gray-900">{analytics.lastSessionPresent}</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-gray-300 ring-4 ring-gray-50" />
                     <span className="text-sm font-medium text-gray-600">Absent</span>
                   </div>
                   <span className="text-lg font-bold text-gray-900">{analytics.lastSessionAbsent}</span>
                </div>
              </div>
            </div>
          ) : (
             <div className="h-32 flex items-center justify-center text-gray-400 font-medium">No sessions recorded yet</div>
          )}
        </div>

        {/* Recent Trend */}
        <div className="bg-surface p-6 rounded-2xl shadow-soft border border-white/60">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Attendance Trend</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.recentSessions}>
                <XAxis 
                    dataKey="name" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{fill: '#94a3b8'}}
                    dy={10}
                />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                />
                <Bar 
                    dataKey="present" 
                    fill="#3b82f6" 
                    radius={[6, 6, 6, 6]} 
                    barSize={24} 
                    background={{ fill: '#f1f5f9', radius: 6 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;