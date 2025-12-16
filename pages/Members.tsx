import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MemberCard from '../components/MemberCard';
import { Member } from '../types';
import { getMembers, deleteMember } from '../services/storage';
import { Plus, Search, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setMembers(getMembers());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      deleteMember(id);
      // Immediately update local state to reflect change
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredMembers = members.filter(m => 
    m.firstName.toLowerCase().includes(search.toLowerCase()) || 
    m.surname.toLowerCase().includes(search.toLowerCase()) ||
    m.itsNumber.includes(search)
  );

  return (
    <div className="relative min-h-full">
      <Header title="Members" />

      {/* Floating Search Bar */}
      <div className="px-5 sticky top-16 z-30 pb-4 -mt-2">
        <div className="relative shadow-lg shadow-gray-200/50 rounded-2xl">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-primary" size={20} />
            <input 
              type="text"
              placeholder="Search members..."
              className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-2xl focus:outline-none text-gray-800 placeholder:text-gray-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-3 pb-32">
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onClick={() => navigate(`/members/${member.id}`)}
              onDelete={(e) => handleDelete(e, member.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <UserX size={32} className="opacity-40" />
            </div>
            <p className="font-medium">No members found</p>
            <p className="text-sm opacity-60">Try a different search term</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={() => navigate('/members/new')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-[20px] shadow-glow shadow-blue-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-4 border-white/20 backdrop-blur-sm"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default Members;