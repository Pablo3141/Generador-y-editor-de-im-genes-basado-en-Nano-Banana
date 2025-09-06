
import React from 'react';

interface FunctionCardProps {
  icon: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ icon, name, isActive, onClick }) => {
  return (
    <div
      className={`function-card p-4 rounded-lg cursor-pointer transition duration-200 border-2 ${
        isActive
          ? 'bg-indigo-600/30 border-indigo-500'
          : 'bg-slate-700 border-slate-600 hover:bg-slate-600/50 hover:border-slate-500'
      }`}
      onClick={onClick}
    >
      <div className="text-2xl">{icon}</div>
      <div className="font-semibold text-sm mt-1 text-slate-200">{name}</div>
    </div>
  );
};

export default FunctionCard;
