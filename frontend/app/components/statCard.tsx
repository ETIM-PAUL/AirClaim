import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon }) => (
  <div className="bg-[#111] p-4 rounded-xl text-white shadow w-full flex flex-col gap-2">
    <h4 className="text-sm text-gray-400 flex items-center gap-2">{title}</h4>
    <div className="flex items-center gap-3">
      {icon && <span>{icon}</span>}
      <p className="text-3xl font-extrabold tracking-tight">{value}</p>
    </div>
    <span className={`text-sm flex items-center gap-1 ${positive ? 'text-green-400' : 'text-red-400'}`}
      >{positive ? <span className="animate-bounce">▲</span> : <span className="animate-bounce">▼</span>} {change} since last month
    </span>
  </div>
);

export default StatCard;
  