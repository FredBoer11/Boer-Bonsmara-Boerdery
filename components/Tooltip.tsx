import React from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="relative flex items-center group ml-2">
      <Info size={16} className="text-gray-400 cursor-pointer group-hover:text-brand-green" />
      <div
        className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 transform
                   invisible opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100"
      >
        <div className="relative rounded-md bg-brand-brown p-3 text-sm font-normal text-white shadow-lg">
          <p>{text}</p>
          <svg
            className="absolute left-1/2 top-full h-2 w-full -translate-x-1/2 text-brand-brown"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            xmlSpace="preserve"
          >
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
