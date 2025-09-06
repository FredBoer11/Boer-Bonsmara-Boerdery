
import React from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinancialYear } from '../types';

interface FinancialChartProps {
  data: FinancialYear[];
}

// Custom Tooltip for better aesthetics
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-brand-green mb-2">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} className="flex justify-between items-center text-sm py-0.5">
            <span style={{ color: pld.stroke || pld.fill }}>{pld.name}:</span>
            <span className="font-semibold ml-4">
              {pld.dataKey === 'herdSize'
                ? `${pld.value.toLocaleString()} Animals`
                : new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(pld.value)
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => `R${(value / 1000).toFixed(0)}k`;
  const formatNumber = (value: number) => `${value}`;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
             <linearGradient id="colorHerd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" dy={10} />
          <YAxis 
            yAxisId="left" 
            tickFormatter={formatCurrency} 
            stroke="#6b7280"
            dx={-10}
            label={{ value: 'Cash Flow (ZAR)', angle: -90, position: 'insideLeft', offset: -25, style: { textAnchor: 'middle', fill: '#6b7280' } }}
           />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tickFormatter={formatNumber} 
            stroke="#f97316"
            dx={10}
            label={{ value: 'Herd Size', angle: 90, position: 'insideRight', offset: -25, style: { textAnchor: 'middle', fill: '#f97316' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Area type="monotone" yAxisId="left" dataKey="income" name="Income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2.5} />
          <Area type="monotone" yAxisId="left" dataKey="expenses" name="Expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2.5} />
          <Area type="monotone" yAxisId="right" dataKey="herdSize" name="Herd Size" stroke="#f97316" fillOpacity={1} fill="url(#colorHerd)" strokeWidth={2.5} />
          <Line type="monotone" yAxisId="left" dataKey="netCashFlow" name="Net Cash Flow" stroke="#3b82f6" strokeWidth={3.5} dot={false} activeDot={{ r: 6 }} />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;