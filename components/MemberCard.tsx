import React from 'react';
import { Member } from '../types';
import { ChevronRight, Trash2 } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(e);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-surface p-3.5 rounded-2xl shadow-soft border border-transparent hover:border-blue-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="relative shrink-0">
        <img 
          src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.firstName}+${member.surname}&background=random&color=fff`} 
          alt={member.firstName}
          className="w-14 h-14 rounded-full object-cover shadow-sm bg-gray-100" 
        />
        <span 
          className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${member.isActive ? 'bg-success' : 'bg-gray-300'}`}
        />
      </div>
      
      <div className="flex-1 min-w-0 py-1">
        <h3 className="font-bold text-gray-900 truncate text-[15px]">{member.firstName} {member.surname}</h3>
        <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
          <span className="bg-gray-50 px-1.5 py-0.5 rounded text-gray-600 border border-gray-100">{member.itsNumber}</span>
          <span className="mx-1.5 text-gray-300">|</span>
          Grade {member.grade}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-20 relative"
            title="Delete Member"
          >
            <Trash2 size={18} />
          </button>
        )}
        
        <div 
          className="w-1.5 h-8 rounded-full opacity-80" 
          style={{ backgroundColor: member.houseColor ? member.houseColor.toLowerCase() : 'gray' }} 
        />
        
        <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
};

export default MemberCard;