
import { useMemo } from 'react';
import { ProposalData, CalculatedData, FinancialYear } from '../types';

export const useProposalCalculations = (data: ProposalData): CalculatedData => {
  return useMemo(() => {
    const {
      totalFarmSize, conservationPercentage, regionalLSUPerHectare,
      foundationCows, foundationBulls, weaningPercentage, cowReplacementRate,
      studBullSalePrice, studHeiferSalePrice, avgWeaningWeight,
      commercialWeanerPricePerKg, cullCowSalePrice, monthlyLabourCost,
      infrastructureSetupBudget, livestockStartupCost, vetCostPerHead, feedCostPerHead
    } = data;

    const conservationArea = totalFarmSize * (conservationPercentage / 100);
    const grazingArea = totalFarmSize - conservationArea;
    const maxLSU = grazingArea * regionalLSUPerHectare;

    // --- Advanced Herd and Financial Simulation based on agricultural best practices ---
    const financials: FinancialYear[] = [];
    let cumulativeCashFlow = 0;
    
    // LSU factors based on report for more accurate carrying capacity management
    const lsuPerCow = 1.1;
    const lsuPerBull = 1.5;
    const lsuPerHeiferY2 = 0.8; // 1-2 year olds
    const lsuPerHeiferY1 = 0.6; // 0-1 year olds

    // Herd state variables
    let breedingCows = foundationCows;
    let heifersY1 = 0; // 0-1 years old
    let heifersY2 = 0; // 1-2 years old
    let bulls = foundationBulls;

    for (let i = 1; i <= 10; i++) {
      // --- 1. Herd Aging ---
      // Heifers from 2 years ago mature into breeding cows
      const newBreedingCowsFromHeifers = heifersY2;
      breedingCows += newBreedingCowsFromHeifers;
      // Heifers from last year age into the 1-2 year old category
      heifersY2 = heifersY1;
      
      // --- 2. Culling and Bull Management ---
      // Cows are culled based on replacement rate.
      const cowsToCull = Math.floor(breedingCows * (cowReplacementRate / 100));
      // Add a bull if the herd grows to maintain fertility
      bulls = breedingCows > 50 ? 3 : foundationBulls;
      
      // --- 3. New Offspring ---
      // Weaning rate determines new calves for the year.
      const weanRate = weaningPercentage / 100;
      const calvesWeaned = Math.floor(breedingCows * weanRate);
      const femaleCalves = Math.floor(calvesWeaned / 2);
      const maleCalves = calvesWeaned - femaleCalves;

      // --- 4. Determine Heifers to Retain (Capacity Management) ---
      // This is the core of the sustainable model. We only keep heifers if there's space.
      // Calculate current LSU of the herd *after* culling but *before* adding new calves.
      const currentLSU = ((breedingCows - cowsToCull) * lsuPerCow) + (bulls * lsuPerBull) + (heifersY2 * lsuPerHeiferY2);
      const lsuSpaceAvailable = maxLSU - currentLSU;
      const heifersAllowedByLSU = lsuSpaceAvailable > 0 ? Math.floor(lsuSpaceAvailable / lsuPerHeiferY1) : 0;
      
      // We can only keep from the female calves we actually have.
      const heifersToKeep = Math.min(femaleCalves, Math.max(0, heifersAllowedByLSU));
      heifersY1 = heifersToKeep; // This year's retained 0-1yr old heifers.

      // --- 5. Sales Calculation (Dynamic Model) ---
      // All surplus animals are sold. We don't use a fixed plan.
      const maleWeanersToSell = maleCalves;
      const femaleWeanersToSell = femaleCalves - heifersToKeep;

      let studBullsSold = 0;
      let studHeifersSold = 0;
      // Assume after year 2, the farm's reputation grows, allowing a higher percentage
      // of surplus animals to be sold as premium "stud" stock.
      let studSalePercentage = 0;
      if (i === 3) {
        studSalePercentage = 0.20; // Year 3: 20%
      } else if (i === 4) {
        studSalePercentage = 0.30; // Year 4: 30%
      } else if (i >= 5) {
        studSalePercentage = 0.40; // Year 5 onwards: 40%
      }
      
      if (studSalePercentage > 0) {
        studBullsSold = Math.floor(maleWeanersToSell * studSalePercentage);
        studHeifersSold = Math.floor(femaleWeanersToSell * studSalePercentage);
      }

      const commercialMaleWeaners = maleWeanersToSell - studBullsSold;
      const commercialFemaleWeaners = femaleWeanersToSell - studHeifersSold;
      const commercialWeanersSold = commercialMaleWeaners + commercialFemaleWeaners;

      // --- 6. Income Calculation ---
      let income = 0;
      income += studBullsSold * studBullSalePrice;
      income += studHeifersSold * studHeiferSalePrice;
      income += cowsToCull * cullCowSalePrice;
      income += commercialWeanersSold * avgWeaningWeight * commercialWeanerPricePerKg;
      
      // --- 7. Expense Calculation ---
      breedingCows -= cowsToCull; // Finalize cow count for the year
      const totalHerdSize = breedingCows + heifersY1 + heifersY2 + bulls;

      const annualLabourCost = monthlyLabourCost * 12;
      // Dynamic auction/marketing cost based on stud sales
      const auctionOpsCost = (studBullsSold + studHeifersSold > 0) ? 50000 + (studBullsSold + studHeifersSold) * 500 : 0;
      const dynamicVetCost = totalHerdSize * vetCostPerHead;
      const dynamicFeedCost = totalHerdSize * feedCostPerHead;

      let yearlyExpenses = annualLabourCost + auctionOpsCost + dynamicVetCost + dynamicFeedCost;
      if (i === 1) {
        yearlyExpenses += infrastructureSetupBudget + livestockStartupCost;
      }
      
      // --- 8. Final Financials for the Year ---
      const netCashFlow = income - yearlyExpenses;
      cumulativeCashFlow += netCashFlow;

      financials.push({
        year: i,
        name: `Year ${i}`,
        income,
        expenses: yearlyExpenses,
        netCashFlow,
        cumulativeCashFlow,
        herdSize: Math.round(totalHerdSize),
      });
    }

    const breakEvenYearIndex = financials.findIndex(year => year.cumulativeCashFlow >= 0);
    const breakEvenYear = breakEvenYearIndex !== -1 ? `Year ${breakEvenYearIndex + 1}` : 'N/A';
    const year10Profit = financials[9]?.netCashFlow ?? 0;
    const totalIncome = financials.reduce((acc, curr) => acc + curr.income, 0);
    const totalExpenses = financials.reduce((acc, curr) => acc + curr.expenses, 0);

    return {
      grazingArea,
      conservationArea,
      maxLSU,
      financials,
      breakEvenYear,
      year10Profit,
      totalIncome,
      totalExpenses,
    };
  }, [data]);
};
