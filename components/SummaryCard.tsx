
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  unit?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, unit }) => {
  return (
    <div className="bg-brand-light p-4 rounded-lg text-center shadow-inner">
      <h3 className="text-sm font-medium text-gray-500 h-10 flex items-center justify-center">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-brand-green tracking-tight">
        {value}
        {unit && <span className="text-base font-normal ml-1">{unit}</span>}
      </p>
    </div>
  );
};

export default SummaryCard;
