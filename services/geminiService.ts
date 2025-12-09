import { GoogleGenAI } from "@google/genai";
import { RentalTransaction, InventoryItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRentalAgreement = async (
  transaction: RentalTransaction,
  item: InventoryItem
): Promise<string> => {
  try {
    const prompt = `
      You are a legal assistant for a rental company named "Soleh Rent".
      Create a formal, short, and clear Rental Agreement (Surat Perjanjian Sewa) in Bahasa Indonesia.

      Details:
      - Company: Soleh Rent
      - Customer: ${transaction.customerName} (NIK: ${transaction.customerNik})
      - Item: ${item.model} (SN: ${item.serialNumber})
      - Start Date: ${transaction.startDate}
      - End Date: ${transaction.endDate}
      - Daily Rate: Rp ${item.dailyRate.toLocaleString()}
      - Total Estimated Cost: Rp ${transaction.totalCost.toLocaleString()}

      The agreement should include clauses about responsibility for damage, late return fees, and that the item belongs to Soleh Rent.
      Keep it professional but concise (under 200 words).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Failed to generate agreement.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating agreement. Please check API key.";
  }
};

export const analyzeFinancials = async (
  transactions: RentalTransaction[],
  inventory: InventoryItem[]
): Promise<string> => {
  try {
    const revenue = transactions.reduce((acc, t) => acc + t.totalCost, 0);
    const activeRentals = transactions.filter(t => t.status === 'Active').length;
    const inventoryCount = inventory.length;

    const prompt = `
      Act as a senior accountant. Analyze the following data for "Soleh Rent":
      - Total Revenue: Rp ${revenue.toLocaleString()}
      - Total Inventory Count: ${inventoryCount}
      - Active Rentals: ${activeRentals}
      - Completed Transactions: ${transactions.length}

      Provide a 3-sentence summary of the financial health and one suggestion for optimization.
      Tone: Professional, academic yet practical.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error analyzing financials.";
  }
};