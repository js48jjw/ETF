export enum InvestmentStyle {
  Stable = "안정 성장형",
  HighDividend = "고배당 추구형",
  Balanced = "균형 투자형",
}

export enum Market {
    KR = "한국",
    US = "미국",
    KR_US = "한국 + 미국",
}

export type DividendFrequency = "월배당" | "분기배당" | "반기배당" | "연배당" | "비정기";

export const ALL_DIVIDEND_FREQUENCIES: DividendFrequency[] = ["월배당", "분기배당", "반기배당", "연배당", "비정기"];

export interface PortfolioOptions {
  investmentAmount: number;
  investmentStyle: InvestmentStyle;
  numberOfEtfs: number;
  market: Market;
  dividendFrequencies: DividendFrequency[];
}

export interface EtfData {
  etfName: string;
  tickerSymbol: string;
  allocationPercentage: number;
  reasoning: string;
  expectedDividendYield: number;
  dividendFrequency: DividendFrequency;
}