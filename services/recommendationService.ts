import { geminiModel } from "../lib/geminiClient";
import type { PropType } from "../types";

export interface RecommendationParams {
  moods: string[];
  budgetRange: string;
  partySize: string;
  foodPreferences: string[];
}

interface GeminiResponse {
  item_ids: number[];
  reasoning?: string;
}

function buildPrompt(
  params: RecommendationParams,
  menuItems: (PropType & { category: string })[],
): string {
  const menuSummary = menuItems.map((item) => ({
    i: item.id,
    n: item.name,
    p: item.price,
    r: item.rating,
    t: item.tag || [],
  }));

  return `Select 6-9 menu items. 
USER: Moods(${params.moods.join(",")}), Budget(${params.budgetRange}), Size(${params.partySize}).
MENU: ${JSON.stringify(menuSummary)}
OUTPUT JSON: {"item_ids": [number], "reasoning": "short string"}`;
}

export async function generateRecommendations(
  params: RecommendationParams,
  menuItems: (PropType & { category: string })[],
): Promise<number[]> {
  if (!menuItems.length) {
    throw new Error("No menu items available.");
  }

  const prompt = buildPrompt(params, menuItems);

  try {
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    let parsed: GeminiResponse;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*"item_ids":\s*\[[^\]]*\]/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0] + "}");
      } else {
        throw new Error("AI returned invalid JSON structure.");
      }
    }

    const validIds = new Set(menuItems.map((item) => item.id));
    const filteredIds = (parsed.item_ids || []).filter((id) => validIds.has(id));

    if (filteredIds.length === 0) {
      throw new Error("AI couldn't find matching items.");
    }

    return filteredIds;
  } catch (error) {
    console.error("[RecommendationAI] Gemini API error:", error);
    throw error;
  }
}
