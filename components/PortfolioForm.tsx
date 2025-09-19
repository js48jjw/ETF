import React from 'react';
import { PortfolioOptions, InvestmentStyle, Market, DividendFrequency, ALL_DIVIDEND_FREQUENCIES } from '../types';

interface PortfolioFormProps {
  options: PortfolioOptions;
  setOptions: React.Dispatch<React.SetStateAction<PortfolioOptions>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ options, setOptions, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  const handleMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMarket = e.target.value as Market;
    let newInvestmentAmount = options.investmentAmount;

    if (newMarket === Market.US) {
        newInvestmentAmount = 10000; // Default for US
    } else if (newMarket === Market.KR) {
        newInvestmentAmount = 10000000; // Default for KR
    } else if (newMarket === Market.KR_US) {
        newInvestmentAmount = 20000000; // Default for combined
    }

    setOptions({
        ...options,
        market: newMarket,
        investmentAmount: newInvestmentAmount,
    });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const frequency = value as DividendFrequency;

    setOptions(prevOptions => {
        const currentFrequencies = prevOptions.dividendFrequencies;
        if (checked) {
            return { ...prevOptions, dividendFrequencies: [...currentFrequencies, frequency] };
        } else {
            return { ...prevOptions, dividendFrequencies: currentFrequencies.filter(f => f !== frequency) };
        }
    });
  };

  const isUSMarket = options.market === Market.US;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-slate-600">
        투자 조건 설정
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Market Selection */}
        <div>
          <label htmlFor="market" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            투자 시장
          </label>
          <select
            id="market"
            value={options.market}
            onChange={handleMarketChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(Market).map((market) => (
              <option key={market} value={market}>
                {market}
              </option>
            ))}
          </select>
        </div>

        {/* Investment Amount */}
        <div>
          <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            총 투자금액 ({isUSMarket ? '$' : '원'})
          </label>
          <input
            type="number"
            id="investmentAmount"
            value={options.investmentAmount}
            onChange={(e) => setOptions({ ...options, investmentAmount: Number(e.target.value) })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            min={isUSMarket ? 1000 : 1000000}
            step={isUSMarket ? 100 : 1000000}
            required
          />
        </div>

        {/* Investment Style */}
        <div>
          <label htmlFor="investmentStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            투자 성향
          </label>
          <select
            id="investmentStyle"
            value={options.investmentStyle}
            onChange={(e) => setOptions({ ...options, investmentStyle: e.target.value as InvestmentStyle })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(InvestmentStyle).map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Number of ETFs */}
        <div>
          <label htmlFor="numberOfEtfs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            포함할 ETF 수
          </label>
          <input
            type="number"
            id="numberOfEtfs"
            value={options.numberOfEtfs}
            onChange={(e) => setOptions({ ...options, numberOfEtfs: Number(e.target.value) })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            min="2"
            max="8"
            required
          />
        </div>
      </div>
      
      {/* Dividend Frequency Selection */}
      <div className="space-y-2 pt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              선호 배당 주기 (중복 선택 가능)
          </label>
          <div className="flex flex-wrap gap-x-6 gap-y-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600">
              {ALL_DIVIDEND_FREQUENCIES.map((freq) => (
                  <div key={freq} className="flex items-center">
                      <input
                          type="checkbox"
                          id={`freq-${freq}`}
                          value={freq}
                          checked={options.dividendFrequencies.includes(freq)}
                          onChange={handleFrequencyChange}
                          className="h-4 w-4 rounded border-gray-300 dark:border-slate-500 bg-gray-100 dark:bg-slate-800 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800"
                      />
                      <label htmlFor={`freq-${freq}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                          {freq}
                      </label>
                  </div>
              ))}
          </div>
      </div>

      <div className="pt-4 text-center">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto inline-flex items-center justify-center px-12 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? '생성 중...' : '포트폴리오 생성'}
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;