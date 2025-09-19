import React, { useState, useCallback, useEffect } from 'react';
import { PortfolioOptions, EtfData, InvestmentStyle, Market } from './types';
import PortfolioForm from './components/PortfolioForm';
import PortfolioDisplay from './components/PortfolioDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generatePortfolio } from './services/geminiService';

const App: React.FC = () => {
  const [options, setOptions] = useState<PortfolioOptions>({
    investmentAmount: 10000000,
    investmentStyle: InvestmentStyle.Balanced,
    numberOfEtfs: 4,
    market: Market.KR,
    dividendFrequencies: [],
  });

  const [portfolio, setPortfolio] = useState<EtfData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="//t1.daumcdn.net/kas/static/ba.min.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', '//t1.daumcdn.net/kas/static/ba.min.js');
      script.setAttribute('async', 'true');
      document.body.appendChild(script);
    }
  }, []);

  const handleGeneratePortfolio = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPortfolio(null);

    try {
      const generatedPortfolio = await generatePortfolio(options);
      setPortfolio(generatedPortfolio);
    } catch (err) {
      console.error(err);
      setError('포트폴리오 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return (
    <>
      {/* Left Ad - Using Right Ad's ID for testing */}
      <aside className="fixed top-1/2 -translate-y-1/2 left-4 z-50 hidden 2xl:block" aria-label="Advertisement">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit="DAN-iZFHkkC931TctMR7"
          data-ad-width="160"
          data-ad-height="600"
        ></ins>
      </aside>

      {/* Right Ad - Using Left Ad's ID for testing */}
      <aside className="fixed top-1/2 -translate-y-1/2 right-4 z-50 hidden 2xl:block" aria-label="Advertisement">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit="DAN-qXttJcZF4ymJRAg2"
          data-ad-width="160"
          data-ad-height="600"
        ></ins>
      </aside>

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 dark:from-blue-400 dark:to-indigo-300">
              AI 배당주 ETF 포트폴리오
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              당신의 투자 성향에 맞는 맞춤형 ETF 포트폴리오를 생성해보세요.
            </p>
          </header>

          <main>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 mb-8 border border-gray-200 dark:border-slate-700">
              <PortfolioForm
                options={options}
                setOptions={setOptions}
                onSubmit={handleGeneratePortfolio}
                isLoading={isLoading}
              />
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center p-10">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 animate-pulse">
                  AI가 최적의 포트폴리오를 구성하고 있습니다...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg" role="alert">
                <p className="font-bold">오류 발생</p>
                <p>{error}</p>
              </div>
            )}

            {portfolio && !isLoading && (
              <PortfolioDisplay
                portfolio={portfolio}
                totalAmount={options.investmentAmount}
                market={options.market}
              />
            )}

            {!portfolio && !isLoading && !error && (
              <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">포트폴리오를 생성할 준비가 되었습니다.</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">위의 옵션을 설정하고 '포트폴리오 생성' 버튼을 클릭하세요.</p>
              </div>
            )}
          </main>

          <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-500">
            <p>본 서비스는 AI를 통해 생성된 정보이며, 투자 조언이 아닙니다. 투자 결정에 대한 책임은 본인에게 있습니다.</p>
            <p>&copy; {new Date().getFullYear()} AI ETF Portfolio Generator. All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;