import React from 'react';
import { FinancialYear } from '../types';

interface FinancialTableProps {
  data: FinancialYear[];
}

const formatCurrency = (value: number) => {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatNumber = (value: number) => {
    return value.toLocaleString('en-ZA');
};

const FinancialTable: React.FC<FinancialTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto p-1">
      <h3 className="text-xl font-bold font-serif text-brand-green mb-4 text-left">Financial & Herd Breakdown</h3>
      <table className="min-w-full bg-white">
        <thead className="bg-brand-green text-white">
          <tr>
            <th scope="col" className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Year</th>
            <th scope="col" className="py-3 px-4 text-right text-sm font-semibold uppercase tracking-wider">Herd Size</th>
            <th scope="col" className="py-3 px-4 text-right text-sm font-semibold uppercase tracking-wider">Income</th>
            <th scope="col" className="py-3 px-4 text-right text-sm font-semibold uppercase tracking-wider">Expenses</th>
            <th scope="col" className="py-3 px-4 text-right text-sm font-semibold uppercase tracking-wider">Net Cash Flow</th>
            <th scope="col" className="py-3 px-4 text-right text-sm font-semibold uppercase tracking-wider">Cumulative Cash Flow</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((year) => (
            <tr key={year.year} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-left text-sm text-gray-800 font-medium whitespace-nowrap">{year.name}</td>
              <td className="py-3 px-4 text-right text-sm text-gray-600 whitespace-nowrap">{formatNumber(year.herdSize)}</td>
              <td className="py-3 px-4 text-right text-sm text-gray-600 whitespace-nowrap">{formatCurrency(year.income)}</td>
              <td className="py-3 px-4 text-right text-sm text-gray-600 whitespace-nowrap">{formatCurrency(year.expenses)}</td>
              <td className={`py-3 px-4 text-right text-sm font-medium whitespace-nowrap ${year.netCashFlow < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(year.netCashFlow)}</td>
              <td className={`py-3 px-4 text-right text-sm font-medium whitespace-nowrap ${year.cumulativeCashFlow < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(year.cumulativeCashFlow)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialTable;