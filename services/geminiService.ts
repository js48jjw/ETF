import { GoogleGenAI, Type } from "@google/genai";
import { PortfolioOptions, EtfData, Market } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getInvestmentStyleDescription = (style: string) => {
    switch(style) {
        case "안정 성장형":
            return "Focus on well-established companies with consistent dividends and potential for moderate capital appreciation. Lower risk.";
        case "고배당 추구형":
            return "Prioritize ETFs with the highest possible dividend yields, even if it means higher volatility. Higher risk.";
        case "균형 투자형":
            return "A mix of stable growth and high-yield ETFs for a balanced risk-reward profile.";
        default:
            return "A balanced approach.";
    }
}

export async function generatePortfolio(options: PortfolioOptions): Promise<EtfData[]> {
  const { investmentAmount, investmentStyle, numberOfEtfs, market, dividendFrequencies } = options;

  const styleDescription = getInvestmentStyleDescription(investmentStyle);

  const marketDetails = {
    [Market.KR]: {
        name: "South Korean",
        exchange: "KRX",
        currency: "KRW",
        tickerExample: "a 6-digit stock market ticker symbol",
        instruction: `Select ${numberOfEtfs} real, publicly-traded dividend-focused ETFs listed on the South Korean stock exchange (KRX).`
    },
    [Market.US]: {
        name: "US",
        exchange: "e.g., NYSE, NASDAQ",
        currency: "USD",
        tickerExample: "a stock market ticker symbol like 'VOO' or 'SCHD'",
        instruction: `Select ${numberOfEtfs} real, publicly-traded dividend-focused ETFs listed on US stock exchanges (e.g., NYSE, NASDAQ).`
    },
    [Market.KR_US]: {
        name: "South Korean and US",
        exchange: "KRX, NYSE, NASDAQ",
        currency: "KRW",
        tickerExample: "the correct format for its respective market (e.g., a 6-digit code for KRX, a symbol like 'VOO' for US)",
        instruction: `Select ${numberOfEtfs} real, publicly-traded dividend-focused ETFs from a mix of the South Korean stock exchange (KRX) and US stock exchanges (e.g., NYSE, NASDAQ). The final portfolio should ideally contain ETFs from BOTH markets.`
    }
  };

  const selectedMarket = marketDetails[market];
  const currencyPrefix = selectedMarket.currency === "USD" ? "$" : "";
  const investmentAmountString = `${currencyPrefix}${investmentAmount.toLocaleString()} ${selectedMarket.currency}`;

  let frequencyInstruction = "";
  if (dividendFrequencies && dividendFrequencies.length > 0) {
      frequencyInstruction = `7. IMPORTANT: The selected ETFs MUST have a dividend frequency that is one of the following: ${dividendFrequencies.join(", ")}.`;
  }


  const prompt = `
You are a financial advisor. Your task is to create a dividend stock ETF portfolio for a user based on their preferences.

User Preferences:
- Target Market: ${selectedMarket.name} stock market(s)
- Total Investment Amount: ${investmentAmountString}
- Investment Style: ${investmentStyle} (${styleDescription})
- Number of ETFs: ${numberOfEtfs}
- Preferred Dividend Frequencies: ${dividendFrequencies.length > 0 ? dividendFrequencies.join(', ') : 'Any'}

Instructions:
1.  ${selectedMarket.instruction}
2.  The selection must align with the user's chosen investment style.
3.  Allocate the total investment amount across the selected ETFs. The sum of all allocation percentages MUST be exactly 100.
4.  Provide a brief, clear reasoning in Korean for each ETF selection.
5.  Provide an estimated annual dividend yield for each ETF.
6.  For the ticker symbol, provide ${selectedMarket.tickerExample}.
${frequencyInstruction}
8.  Provide the dividend payment frequency for each ETF in Korean. Use one of the following values: "월배당", "분기배당", "반기배당", "연배당", or "비정기".

Return ONLY a JSON object that matches the provided schema. Do not include any other text, explanations, or markdown formatting outside of the JSON object.
  `;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        etfName: {
          type: Type.STRING,
          description: `The full name of the dividend ETF.`,
        },
        tickerSymbol: {
          type: Type.STRING,
          description: 'The stock market ticker symbol for the ETF.',
        },
        allocationPercentage: {
          type: Type.NUMBER,
          description: 'The percentage of the total portfolio allocated to this ETF (e.g., 25.5).',
        },
        reasoning: {
          type: Type.STRING,
          description: 'A brief explanation in Korean for selecting this ETF based on the user\'s investment style.',
        },
        expectedDividendYield: {
            type: Type.NUMBER,
            description: 'The estimated annual dividend yield as a percentage (e.g., 4.5).'
        },
        dividendFrequency: {
          type: Type.STRING,
          description: 'The dividend payment frequency in Korean (e.g., "월배당", "분기배당", "연배당").'
        }
      },
      required: ["etfName", "tickerSymbol", "allocationPercentage", "reasoning", "expectedDividendYield", "dividendFrequency"],
    },
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7,
    }
  });

  const jsonText = response.text.trim();
  try {
    const portfolioData: EtfData[] = JSON.parse(jsonText);
    
    // Normalize allocation to ensure it sums to 100%
    const totalAllocation = portfolioData.reduce((sum, item) => sum + item.allocationPercentage, 0);
    if (totalAllocation > 0 && Math.abs(100 - totalAllocation) > 0.1) { // Allow for small floating point inaccuracies
        return portfolioData.map(item => ({
            ...item,
            allocationPercentage: parseFloat(((item.allocationPercentage / totalAllocation) * 100).toFixed(2)),
        }));
    }

    return portfolioData;
  } catch (error) {
    console.error("Failed to parse Gemini response:", jsonText, error);
    throw new Error("The AI returned an invalid portfolio format.");
  }
}