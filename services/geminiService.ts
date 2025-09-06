
import { GoogleGenAI } from "@google/genai";
import { ProposalData, CalculatedData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateProposalNarrative = async (
    proposalData: ProposalData,
    calculatedData: CalculatedData
): Promise<string> => {

  const formatCurrency = (value: number) => `R ${value.toLocaleString('en-ZA')}`;

  const prompt = `
Act as a financial analyst and conservation expert specializing in agricultural ventures. Based on the following data for a proposed Bonsmara cattle stud farm, generate a compelling, professional narrative for an investment proposal.

**Farm Details:**
- Name: ${proposalData.farmName}
- Location: ${proposalData.farmLocation}
- Total Size: ${proposalData.totalFarmSize.toFixed(0)} ha
- Conservation Land: ${calculatedData.conservationArea.toFixed(0)} ha (${proposalData.conservationPercentage}%)
- Grazing Area: ${calculatedData.grazingArea.toFixed(0)} ha
- Max Livestock Capacity (LSU): ${calculatedData.maxLSU.toFixed(0)}

**Key Operational Metrics:**
- Weaning Percentage: ${proposalData.weaningPercentage}%
- Cow Replacement Rate: ${proposalData.cowReplacementRate}%
- Core Revenue Streams: Stud Bulls, Stud Heifers, Commercial Weaners, Cull Cows.

**Financial Projections (10-Year Summary):**
- Initial Capital Outlay (Infra + Livestock): ${formatCurrency(proposalData.infrastructureSetupBudget + proposalData.livestockStartupCost)}
- Projected Year of Positive Annual Cash Flow: Year 3
- Projected Break-Even Point (Cumulative): ${calculatedData.breakEvenYear}
- Year 10 Net Profit: ${formatCurrency(calculatedData.year10Profit)}
- Total 10-Year Income: ${formatCurrency(calculatedData.totalIncome)}
- Key Costs: Labour, plus per-head costs for veterinary care (${formatCurrency(proposalData.vetCostPerHead)}/head) and feed (${formatCurrency(proposalData.feedCostPerHead)}/head).

**Task:**
Write a detailed narrative of approximately 300-400 words. Structure it with the following paragraphs:

1.  **Introduction:** Start with a strong opening that introduces "${proposalData.farmName}" as a premier investment opportunity in sustainable agriculture, located in ${proposalData.farmLocation}. State its core mission to establish a top-tier Bonsmara stud breeding operation.

2.  **Sustainable & Efficient Operations:** Detail the farm's commitment to ecological stewardship through its ${proposalData.conservationPercentage}% conservation area. Explain that herd growth is strategically managed to the farm's carrying capacity (${calculatedData.maxLSU.toFixed(0)} LSU), which will be supported by advanced veld management practices like rotational grazing to enhance forage quality and prevent degradation. Explain that surplus animals are sold annually and replacement heifers selectively retained to ensure herd stability and continuous genetic improvement. Connect this to operational efficiency, citing key KPIs like a ${proposalData.weaningPercentage}% weaning rate and a ${proposalData.cowReplacementRate}% culling strategy as evidence of a data-driven approach to maximizing productivity.

3.  **Financial Viability & Growth:** Present the robust business case. Discuss the strong market demand for the Bonsmara breed. Synthesize the financial projections, highlighting the manageable initial outlay and the dynamic cost structure tied to herd growth. Emphasize the critical milestone of achieving **positive annual cash flow by Year 3**, which signals rapid operational maturity and self-sustainability. Following this, discuss the project's overall **cumulative break-even point in ${calculatedData.breakEvenYear}** and its strong profitability by Year 10. Frame this as evidence of a well-structured, financially sound operational plan with multiple revenue streams. Crucially, highlight that the significant ${proposalData.conservationPercentage}% conservation area presents future opportunities for diversified, low-impact income streams (e.g., specialized eco-tourism, selective hunting), adding long-term asset value and ecological credentials.

4.  **Conclusion & Vision:** Conclude with a powerful statement on the project's long-term vision. Emphasize its potential to deliver significant financial returns to investors while setting a new standard for profitable, data-driven, and conservation-focused farming in the region.

Maintain a professional, confident, and persuasive tone suitable for investors and grant committees. The output must be plain text without any markdown. Separate paragraphs with a double newline character ('\n\n').
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating narrative with Gemini:", error);
    throw new Error("Could not generate narrative from Gemini API.");
  }
};
