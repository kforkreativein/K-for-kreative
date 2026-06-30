import { GoogleGenerativeAI } from '@google/generative-ai'

const STAGE_LABELS = {
  starting: 'just starting out',
  some_sales: 'making some sales',
  scaling: 'scaling up',
}

export async function generateRoadmap(data) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

  const prompt = `You are a business growth strategist for creative entrepreneurs, coaches, and personal brands.

Client profile:
- Name: ${data.name}
- Brand: ${data.brand_name}
- Niche: ${data.niche}
- Currently sells: ${data.current_offers}
- Stage: ${STAGE_LABELS[data.stage] || data.stage}
- Biggest challenge: ${data.challenge}
- 90-day goal: ${data.goal_90}

Return ONLY a valid JSON object — no markdown, no code blocks. Shape:
{
  "summary": "2–3 sentences on where they are now, specific to their niche",
  "gap": "1–2 sentences on the single biggest gap, specific to their challenge",
  "quick_wins": ["action today 1", "action today 2", "action today 3"],
  "day30": ["step 1", "step 2", "step 3", "step 4"],
  "day60": ["step 1", "step 2", "step 3", "step 4"],
  "day90": ["step 1", "step 2", "step 3", "step 4"]
}

Be specific to their niche (${data.niche}). Every step must be a concrete action tied to their goal: "${data.goal_90}" and challenge: "${data.challenge}".`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    return JSON.parse(clean)
  } catch {
    return null
  }
}
