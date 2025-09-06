import React, { useState, useCallback, useEffect } from 'react';
import { ProposalData } from './types';
import { useProposalCalculations } from './hooks/useProposalCalculations';
import Header from './components/Header';
import InputField from './components/InputField';
import SummaryCard from './components/SummaryCard';
import FinancialChart from './components/FinancialChart';
import NarrativeSection from './components/NarrativeSection';
import FinancialTable from './components/FinancialTable';
import ProposalManager from './components/ProposalManager';
import PasswordProtection from './components/PasswordProtection';
import AboutPage from './components/AboutPage';
import { exportAsPDF } from './services/pdfService';
import { generateProposalNarrative } from './services/geminiService';
import { definitions } from './definitions';
import { Download, Edit, BarChart2, DollarSign, Tractor, Trees } from 'lucide-react';

const SESSION_KEY = 'bbb_authenticated';

// Updated base data to target positive annual cash flow by Year 3
const baseProposalData = {
  farmPrice: 5000000,
  farmLocation: 'Alldays, Limpopo',
  totalFarmSize: 2000,
  conservationPercentage: 20,
  regionalLSUPerHectare: 0.17,
  foundationCows: 50,
  foundationBulls: 3,
  weaningPercentage: 90,
  cowReplacementRate: 15,
  studBullSalePrice: 80000, // Increased to ensure Y3+ cash flow
  studHeiferSalePrice: 40000, // Increased to ensure Y3+ cash flow
  avgWeaningWeight: 240,
  commercialWeanerPricePerKg: 38,
  cullCowSalePrice: 9000,
  monthlyLabourCost: 25000,
  infrastructureSetupBudget: 500000,
  livestockStartupCost: 800000,
  vetCostPerHead: 350,
  feedCostPerHead: 1100, // Reduced based on better veld management
};

const createNewProposal = (): ProposalData => {
  const newId = `farm_${Date.now()}`;
  return {
    id: newId,
    farmName: `Boer Bonsmara Boerdery`,
    ...baseProposalData,
  };
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  
  const [view, setView] = useState<'calculator' | 'about'>('calculator');

  const [proposals, setProposals] = useState<ProposalData[]>(() => {
    try {
      const savedProposals = localStorage.getItem('farmProposals');
      if (savedProposals) {
        const parsed = JSON.parse(savedProposals);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to parse proposals from localStorage", error);
    }
    return [createNewProposal()];
  });

  const [activeProposalId, setActiveProposalId] = useState<string | null>(() => {
    const lastActiveId = localStorage.getItem('lastActiveFarmId');
    const proposalExists = proposals.some(p => p.id === lastActiveId);
    return lastActiveId && proposalExists ? lastActiveId : proposals[0]?.id || null;
  });
  
  const activeProposal = proposals.find(p => p.id === activeProposalId);

  useEffect(() => {
    try {
      localStorage.setItem('farmProposals', JSON.stringify(proposals));
      if (activeProposalId) {
        localStorage.setItem('lastActiveFarmId', activeProposalId);
      }
    } catch (error) {
      console.error("Failed to save proposals to localStorage", error);
    }
  }, [proposals, activeProposalId]);

   useEffect(() => {
    if (!activeProposal && proposals.length > 0) {
      setActiveProposalId(proposals[0].id);
    }
  }, [activeProposal, proposals]);

  const calculated = useProposalCalculations(activeProposal || proposals[0]);
  
  const [narrative, setNarrative] = useState('');
  const [isNarrativeLoading, setIsNarrativeLoading] = useState(true);
  const [narrativeError, setNarrativeError] = useState<string | null>(null);

  const fetchNarrative = useCallback(async () => {
    if (!activeProposal) return;
    setIsNarrativeLoading(true);
    setNarrativeError(null);
    try {
      const result = await generateProposalNarrative(activeProposal, calculated);
      setNarrative(result);
    } catch (err) {
      console.error(err);
      setNarrativeError('Failed to generate proposal narrative. Please check your API key and try again.');
    } finally {
      setIsNarrativeLoading(false);
    }
  }, [activeProposal, calculated]);

  useEffect(() => {
    if (view === 'calculator') {
        const handler = setTimeout(() => {
        fetchNarrative();
        }, 1500);
        return () => clearTimeout(handler);
    }
  }, [fetchNarrative, view]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setProposals(prevProposals =>
      prevProposals.map(p =>
        p.id === activeProposalId
          ? { ...p, [name]: type === 'number' ? parseFloat(value) || 0 : value }
          : p
      )
    );
  }, [activeProposalId]);
  
  const handleAddNewProposal = () => {
    const newProposal = createNewProposal();
    const uniqueName = `New Farm ${Date.now().toString().slice(-4)}`;
    newProposal.farmName = uniqueName;
    setProposals(prev => [...prev, newProposal]);
    setActiveProposalId(newProposal.id);
  };
  
  const handleDeleteProposal = (idToDelete: string) => {
    if (proposals.length <= 1) return;
    setProposals(prev => prev.filter(p => p.id !== idToDelete));
  };

  const handleRenameProposal = (idToRename: string, newName: string) => {
    setProposals(prev => 
      prev.map(p => 
        p.id === idToRename ? { ...p, farmName: newName } : p
      )
    );
  };

  const handleSelectProposal = (id: string) => {
    setActiveProposalId(id);
  };

  const handleExport = () => {
    if (!activeProposal) return;
    exportAsPDF(activeProposal.farmName, narrative, calculated.financials);
  };

  const handleLoginSuccess = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Could not save session state", error);
      // Fallback for private browsing or other storage issues
      setIsAuthenticated(true);
    }
  };

  const formatCurrency = (value: number) => {
    return `R ${value.toLocaleString('en-ZA')}`;
  };

  if (!isAuthenticated) {
    return <PasswordProtection onLoginSuccess={handleLoginSuccess} />;
  }
  
  const renderCalculator = () => {
      if (!activeProposal) {
        return (
          <div className="min-h-screen font-sans text-brand-brown flex items-center justify-center">
            Loading proposals...
          </div>
        );
      }
      return (
         <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-8">
                <ProposalManager
                proposals={proposals}
                activeProposalId={activeProposalId}
                onSelect={handleSelectProposal}
                onAdd={handleAddNewProposal}
                onDelete={handleDeleteProposal}
                onRename={handleRenameProposal}
                />

                <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 h-fit">
                <h2 className="text-2xl font-bold font-serif text-brand-green flex items-center mb-4">
                    <Edit className="mr-2 h-6 w-6"/>
                    Proposal Inputs
                </h2>

                {/* Farm & Land Section */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg text-brand-green flex items-center -ml-1"><Trees size={20} className="mr-2"/>Farm & Land</h3>
                    <InputField label="Farm Name" name="farmName" value={activeProposal.farmName} onChange={handleInputChange} tooltipText={definitions.farmName} />
                    <InputField label="Farm Location" name="farmLocation" value={activeProposal.farmLocation} onChange={handleInputChange} tooltipText={definitions.farmLocation} />
                    <InputField label="Total Farm Size" name="totalFarmSize" value={activeProposal.totalFarmSize} onChange={handleInputChange} type="number" unit="ha" tooltipText={definitions.totalFarmSize} />
                    <InputField label="Conservation Land" name="conservationPercentage" value={activeProposal.conservationPercentage} onChange={handleInputChange} type="number" unit="%" tooltipText={definitions.conservationPercentage} />
                    <InputField label="Regional LSU per ha" name="regionalLSUPerHectare" value={activeProposal.regionalLSUPerHectare} onChange={handleInputChange} type="number" step={0.01} tooltipText={definitions.regionalLSUPerHectare} />
                </div>

                {/* Herd Parameters Section */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg text-brand-green flex items-center -ml-1"><BarChart2 size={20} className="mr-2"/>Herd Parameters</h3>
                    <InputField label="Foundation Stud Cows" name="foundationCows" value={activeProposal.foundationCows} onChange={handleInputChange} type="number" tooltipText={definitions.foundationCows} />
                    <InputField label="Foundation Bulls" name="foundationBulls" value={activeProposal.foundationBulls} onChange={handleInputChange} type="number" tooltipText={definitions.foundationBulls} />
                    <InputField label="Weaning Percentage" name="weaningPercentage" value={activeProposal.weaningPercentage} onChange={handleInputChange} type="number" unit="%" tooltipText={definitions.weaningPercentage} />
                    <InputField label="Cow Replacement Rate" name="cowReplacementRate" value={activeProposal.cowReplacementRate} onChange={handleInputChange} type="number" unit="%" tooltipText={definitions.cowReplacementRate} />
                </div>
                
                {/* Revenue Section */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg text-brand-green flex items-center -ml-1"><DollarSign size={20} className="mr-2"/>Revenue</h3>
                    <InputField label="Stud Bull Sale Price" name="studBullSalePrice" value={activeProposal.studBullSalePrice} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.studBullSalePrice} />
                    <InputField label="Stud Heifer Sale Price" name="studHeiferSalePrice" value={activeProposal.studHeiferSalePrice} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.studHeiferSalePrice} />
                    <InputField label="Cull Cow Sale Price" name="cullCowSalePrice" value={activeProposal.cullCowSalePrice} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.cullCowSalePrice} />
                    <InputField label="Avg. Weaning Weight" name="avgWeaningWeight" value={activeProposal.avgWeaningWeight} onChange={handleInputChange} type="number" unit="kg" tooltipText={definitions.avgWeaningWeight} />
                    <InputField label="Weaner Price per kg" name="commercialWeanerPricePerKg" value={activeProposal.commercialWeanerPricePerKg} onChange={handleInputChange} type="number" unit="R/kg" tooltipText={definitions.commercialWeanerPricePerKg} />
                </div>

                {/* Costs Section */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg text-brand-green flex items-center -ml-1"><Tractor size={20} className="mr-2"/>Operating Costs</h3>
                    <InputField label="Monthly Labour Cost" name="monthlyLabourCost" value={activeProposal.monthlyLabourCost} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.monthlyLabourCost} />
                    <InputField label="Vet Cost per Head/Year" name="vetCostPerHead" value={activeProposal.vetCostPerHead} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.vetCostPerHead} />
                    <InputField label="Feed & Lick per Head/Year" name="feedCostPerHead" value={activeProposal.feedCostPerHead} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.feedCostPerHead} />
                    <InputField label="Infrastructure Setup" name="infrastructureSetupBudget" value={activeProposal.infrastructureSetupBudget} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.infrastructureSetupBudget} />
                    <InputField label="Livestock Startup Cost" name="livestockStartupCost" value={activeProposal.livestockStartupCost} onChange={handleInputChange} type="number" unit="R" tooltipText={definitions.livestockStartupCost} />
                </div>
                </div>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-2 space-y-8">
                <div id="pdf-summary-container" className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold font-serif text-brand-green mb-4">Farm & Capacity Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SummaryCard title="Total Farm Size" value={`${calculated.grazingArea + calculated.conservationArea}`} unit="ha" />
                    <SummaryCard title="Grazing Area" value={calculated.grazingArea.toFixed(0)} unit="ha" />
                    <SummaryCard title="Conservation Area" value={calculated.conservationArea.toFixed(0)} unit="ha" />
                    <SummaryCard title="Max LSU" value={calculated.maxLSU.toFixed(0)} unit="units" />
                    </div>
                </div>

                <div id="pdf-financial-overview" className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold font-serif text-brand-green mb-4">Financial Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <SummaryCard title="Year 10 Profit" value={formatCurrency(calculated.year10Profit)} />
                    <SummaryCard title="Break-even Year" value={`${calculated.breakEvenYear}`} />
                    </div>
                </div>
                
                <div id="pdf-chart-container" className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold font-serif text-brand-green mb-4">10-Year Cash Flow & Herd Growth Forecast</h2>
                <FinancialChart data={calculated.financials} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                <FinancialTable data={calculated.financials} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <NarrativeSection 
                    narrative={narrative}
                    isLoading={isNarrativeLoading}
                    error={narrativeError}
                    onRefresh={fetchNarrative} 
                    />
                </div>
            </div>
            </div>

            <div className="text-center pt-4">
                <button
                    onClick={handleExport}
                    disabled={isNarrativeLoading}
                    className="inline-flex items-center justify-center bg-brand-green text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-800 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                    <Download className="mr-2 h-5 w-5" />
                    {isNarrativeLoading ? 'Generating Narrative...' : 'Export as PDF'}
                </button>
            </div>
        </main>
      );
  }

  return (
    <div className="min-h-screen font-sans text-brand-brown">
      <Header 
        farmName={activeProposal?.farmName || "Bonsmara Proposal Builder"} 
        activeView={view}
        onNavigate={setView}
      />
      
      {view === 'calculator' ? renderCalculator() : <AboutPage />}

      {/* Hidden container for PDF-only elements */}
      <div className="absolute -left-[9999px] top-auto w-[800px] p-8 bg-white" aria-hidden="true">
        <div id="pdf-table-container">
          <FinancialTable data={calculated?.financials || []} />
        </div>
      </div>
    </div>
  );
};

export default App;
