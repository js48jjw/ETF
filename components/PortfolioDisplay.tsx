import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EtfData, Market } from '../types';
import ETFCard from './ETFCard';

interface PortfolioDisplayProps {
  portfolio: EtfData[];
  totalAmount: number;
  market: Market;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#00E396'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-700 p-2 border border-gray-200 dark:border-slate-600 rounded shadow-lg">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-sm">{`비중: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const PortfolioDisplay: React.FC<PortfolioDisplayProps> = ({ portfolio, totalAmount, market }) => {
    const chartData = portfolio.map(etf => ({
        name: etf.etfName,
        value: etf.allocationPercentage,
    }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">포트폴리오 구성</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map((etf, index) => (
                <ETFCard 
                    key={etf.tickerSymbol}
                    etf={etf} 
                    amount={totalAmount * (etf.allocationPercentage / 100)} 
                    color={COLORS[index % COLORS.length]}
                    market={market}
                />
            ))}
          </div>
        </div>
      </div>

       <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-slate-700">
         <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">세부 정보</h2>
         <div className="space-y-6">
            {portfolio.map((etf) => (
                <div key={etf.tickerSymbol} className="border-b dark:border-slate-700 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{etf.etfName} ({etf.tickerSymbol})</h3>
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full">{etf.dividendFrequency}</span>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{etf.reasoning}</p>
                </div>
            ))}
         </div>
       </div>

    </div>
  );
};

export default PortfolioDisplay;