export interface ProposalData {
  id: string;
  farmName: string;
  farmPrice: number;
  farmLocation: string;
  totalFarmSize: number;
  conservationPercentage: number;
  regionalLSUPerHectare: number;
  foundationCows: number;
  foundationBulls: number;
  
  // New Herd & Reproduction Metrics
  weaningPercentage: number;
  cowReplacementRate: number;

  // New Revenue Metrics
  studBullSalePrice: number;
  studHeiferSalePrice: number;
  avgWeaningWeight: number;
  commercialWeanerPricePerKg: number;
  cullCowSalePrice: number;

  // New Cost Metrics
  monthlyLabourCost: number;
  infrastructureSetupBudget: number;
  livestockStartupCost: number;
  vetCostPerHead: number;
  feedCostPerHead: number;
}

export interface FinancialYear {
  year: number;
  name: string;
  income: number;
  expenses: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  herdSize: number;
}

export interface CalculatedData {
  grazingArea: number;
  conservationArea: number;
  maxLSU: number;
  financials: FinancialYear[];
  breakEvenYear: number | string;
  year10Profit: number;
  totalIncome: number;
  totalExpenses: number;
}