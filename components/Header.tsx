import React from 'react';
import { Leaf, Calculator, Info } from 'lucide-react';

interface HeaderProps {
  farmName: string;
  activeView: 'calculator' | 'about';
  onNavigate: (view: 'calculator' | 'about') => void;
}

const Header: React.FC<HeaderProps> = ({ farmName, activeView, onNavigate }) => {
  const navLinkClasses = "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-brand-tan text-brand-brown shadow-inner";
  const inactiveClasses = "text-white hover:bg-white/10";

  return (
    <header className="bg-brand-green text-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Leaf size={32} className="text-brand-tan"/>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold font-serif tracking-tight">
                {activeView === 'calculator' ? farmName : "Boer Bonsmara Boerdery"}
              </h1>
              <p className="text-sm text-brand-tan/90">Cattle Stud Farm Proposal Builder</p>
            </div>
          </div>

          <nav className="flex items-center gap-2 bg-black/20 p-1.5 rounded-lg">
            <button
              onClick={() => onNavigate('calculator')}
              className={`${navLinkClasses} ${activeView === 'calculator' ? activeClasses : inactiveClasses}`}
              aria-current={activeView === 'calculator' ? 'page' : undefined}
            >
              <Calculator size={16} />
              Calculator
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`${navLinkClasses} ${activeView === 'about' ? activeClasses : inactiveClasses}`}
              aria-current={activeView === 'about' ? 'page' : undefined}
            >
              <Info size={16} />
              About Bonsmara Farming
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;