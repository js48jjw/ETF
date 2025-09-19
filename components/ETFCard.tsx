import React from 'react';
import { EtfData, Market } from '../types';

interface ETFCardProps {
  etf: EtfData;
  amount: number;
  color: string;
  market: Market;
}

const ETFCard: React.FC<ETFCardProps> = ({ etf, amount, color, market }) => {
  const isUSMarket = market === Market.US;
  const formattedAmount = isUSMarket 
    ? `$${Math.round(amount).toLocaleString()}`
    : `${Math.round(amount).toLocaleString()}원`;

  return (
    <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border-l-4" style={{ borderColor: color }}>
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{etf.etfName}</h4>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-600 px-2 py-1 rounded-full">{etf.tickerSymbol}</span>
        </div>
        <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">투자 비중:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{etf.allocationPercentage}%</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">투자 금액:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{formattedAmount}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">예상 배당률:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{etf.expectedDividendYield}%</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">배당 주기:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{etf.dividendFrequency}</span>
            </div>
        </div>
    </div>
  );
};

export default ETFCard;
