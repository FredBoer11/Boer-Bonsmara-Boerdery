import React from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

interface NarrativeSectionProps {
  narrative: string;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const NarrativeSection: React.FC<NarrativeSectionProps> = ({ narrative, isLoading, error, onRefresh }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif text-brand-green flex items-center">
            <BookOpen className="mr-2 h-6 w-6"/>
            Investment Narrative
        </h2>
        <button onClick={onRefresh} disabled={isLoading} className="text-brand-green hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}/>
        </button>
      </div>
      
      {isLoading && (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      )}
      {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
      {!isLoading && !error && (
        <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap font-serif break-words">
          {narrative.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default NarrativeSection;
