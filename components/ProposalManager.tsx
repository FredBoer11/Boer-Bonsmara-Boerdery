import React, { useState, useEffect, useRef } from 'react';
import { ProposalData } from '../types';
import { PlusCircle, Trash2, Home, Edit2 } from 'lucide-react';

interface ProposalManagerProps {
  proposals: ProposalData[];
  activeProposalId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

const ProposalManager: React.FC<ProposalManagerProps> = ({ proposals, activeProposalId, onSelect, onAdd, onDelete, onRename }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartEditing = (proposal: ProposalData) => {
    if (editingId === proposal.id) return;
    setEditingId(proposal.id);
    setTempName(proposal.farmName);
  };

  const handleFinishEditing = () => {
    if (editingId && tempName.trim()) {
      onRename(editingId, tempName.trim());
    }
    setEditingId(null);
    setTempName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setTempName('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 h-fit">
      <h2 className="text-2xl font-bold font-serif text-brand-green flex items-center mb-4">
        <Home className="mr-2 h-6 w-6"/>
        My Farm Proposals
      </h2>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {proposals.length > 0 ? proposals.map(proposal => (
          <div key={proposal.id} className="flex items-center gap-1.5 group">
            {editingId === proposal.id ? (
              <input
                ref={inputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleFinishEditing}
                onKeyDown={handleKeyDown}
                className="w-full text-left p-3 rounded-lg bg-white border border-brand-green ring-2 ring-brand-tan shadow-inner focus:outline-none"
                aria-label="Rename farm proposal"
              />
            ) : (
               <>
                <button
                  onClick={() => onSelect(proposal.id)}
                  onDoubleClick={() => handleStartEditing(proposal)}
                  className={`flex-grow text-left p-3 rounded-lg transition-colors duration-200 truncate ${
                    proposal.id === activeProposalId
                      ? 'bg-brand-tan text-brand-brown font-semibold shadow-inner'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Double-click to rename"
                >
                  {proposal.farmName || 'Untitled Farm'}
                </button>
                <div className="flex">
                  <button
                    onClick={() => handleStartEditing(proposal)}
                    className="p-2 text-gray-400 hover:text-brand-green transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Rename ${proposal.farmName}`}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${proposal.farmName}"? This action cannot be undone.`)) {
                        onDelete(proposal.id);
                      }
                    }}
                    className={`p-2 text-gray-400 hover:text-red-500 transition-opacity duration-200 ${proposals.length <= 1 ? 'opacity-0 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'}`}
                    aria-label={`Delete ${proposal.farmName}`}
                    disabled={proposals.length <= 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )) : (
            <p className="text-center text-gray-500 py-4">No proposals yet. Add one to get started!</p>
        )}
      </div>
      <button
        onClick={onAdd}
        className="w-full mt-4 inline-flex items-center justify-center bg-brand-green text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-800 transition-all duration-300 transform hover:scale-105"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add New Farm Proposal
      </button>
    </div>
  );
};

export default ProposalManager;
