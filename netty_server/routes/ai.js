const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Record = require('../models/Record');
const MonthlyLog = require('../models/MonthlyLog');
const GrowthPlan = require('../models/GrowthPlan');

// Initialize OpenAI
// Ensure OPENAI_API_KEY is set in .env
let openai;
try {
    if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    } else {
        console.warn("OPENAI_API_KEY is not set. AI features will not work.");
    }
} catch (err) {
    console.error("Failed to initialize OpenAI:", err);
}

// Helper to call OpenAI
async function callLLM(systemPrompt, userPrompt) {
    if (!openai) {
        throw new Error("OpenAI API Key is missing. Please set OPENAI_API_KEY in .env file.");
    }
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-4o-mini", // or gpt-3.5-turbo depending on budget/availability
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error("Failed to generate AI response");
    }
}

// 1. Draft Monthly Indicator Log
// POST /api/ai/draft/monthly-indicator
router.post('/draft/monthly-indicator', async (req, res) => {
    try {
        const { userId, year, month, activityContent } = req.body;

        if (!userId || !year || !month || !activityContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Calculate date range for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month

        // Fetch Daily Records for this user in this month
        const records = await Record.find({
            userId: userId, // Note: Record model uses String userId currently based on previous context, verify if it matches
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        if (records.length === 0) {
            return res.json({ draft: "해당 기간에 작성된 일상 기록이 없습니다." });
        }

        // Prepare context from records
        const recordsText = records.map(r =>
            `[${new Date(r.date).toLocaleDateString()}] ${r.content}`
        ).join("\n");

        const systemPrompt = `
You are a helpful assistant that drafts a monthly activity log based on daily records.
The user has a specific 'Activity' goal.
Your task is to:
1. Read the daily records.
2. Extract only the parts relevant to the user's 'Activity'.
3. Summarize the progress, achievements, or efforts related to that activity for the month.
4. Write in a polite, reflective tone (Korean).
5. Keep it concise (3-5 sentences).
`;

        const userPrompt = `
Activity: ${activityContent}

Daily Records:
${recordsText}

Draft a monthly log for this activity.
`;

        const draft = await callLLM(systemPrompt, userPrompt);
        res.json({ draft });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. Draft Monthly Analysis (Strength/Weakness/Supplement)
// POST /api/ai/draft/monthly-analysis
router.post('/draft/monthly-analysis', async (req, res) => {
    try {
        const { userId, year, month, type, itemGoal, activityLogs } = req.body;
        // type: 'strength' | 'weakness' | 'supplement'
        // itemGoal: The goal of the growth item
        // activityLogs: Array of logs related to this item's activities

        if (!type || !itemGoal) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const logsText = activityLogs.map(l => `- ${l}`).join("\n");

        let specificInstruction = "";
        if (type === 'strength') {
            specificInstruction = `
Focus ONLY on the "Strength" (잘한 점).
- Identify what was done well, achievements, and positive habits.
- Ignore failures or areas that need improvement.
- Highlight successful execution of action plans.
`;
        } else if (type === 'weakness') {
            specificInstruction = `
Focus ONLY on the "Weakness" (아쉬운 점).
- Identify what was lacking, unfulfilled goals, or difficulties.
- Ignore successes.
- Highlight where the user struggled or failed to follow the action plan.
`;
        } else if (type === 'supplement') {
            specificInstruction = `
Focus ONLY on the "Supplement" (보완할 점 / 행동 보완).
- Suggest concrete improvements for the future.
- Based on the weaknesses, propose specific actions to take next month.
- Do not just list problems; offer solutions.
`;
        }

        const systemPrompt = `
You are a helpful growth coach.
Based on the user's monthly activity logs for a specific goal, draft a short analysis.
The logs include "Action Plans" (실천방안), "Reflections" (활동소감), and "Status" (achieved/unachieved/neutral).

Your task is to write a '${type}' analysis.
${specificInstruction}

Write in Korean.
Tone: Objective, helpful, and encouraging (but critical for weakness).
Keep it concise (3-5 sentences).
`;

        const userPrompt = `
Goal: ${itemGoal}

Activity Logs this month:
${logsText}

Draft a '${type}' analysis.
`;

        const draft = await callLLM(systemPrompt, userPrompt);
        res.json({ draft });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. Draft Yearly Overview
// POST /api/ai/draft/yearly-overview
router.post('/draft/yearly-overview', async (req, res) => {
    try {
        const { userId, year, targetMonth } = req.body;
        // targetMonth is optional. If provided, draft for that month. 
        // But usually Yearly Overview is filled month by month.
        // If the user wants to draft for a specific month in the yearly view, we look at that month's logs.

        // Fetch MonthlyLog for that month
        // We need to find the plan first to get planId? Or just search MonthlyLog by userId/year/month
        // MonthlyLog schema has userId, year, month.

        const monthlyLog = await MonthlyLog.findOne({ userId, year, month: targetMonth });

        if (!monthlyLog) {
            return res.json({ draft: "해당 월의 성장 기록이 없습니다." });
        }

        // Gather all activity logs and analyses
        let context = "Activity Logs:\n";
        monthlyLog.activityLogs.forEach(l => {
            if (l.entries && l.entries.length > 0) {
                l.entries.forEach(e => {
                    context += `- (Status: ${e.status}) Action: ${e.actionPlan}, Reflection: ${e.reflection}\n`;
                });
            } else if (l.log) {
                context += `- ${l.log}\n`;
            }
        });

        context += "\nAnalyses:\n";
        monthlyLog.itemAnalyses.forEach(a => {
            if (a.strength) context += `Strength: ${a.strength}\n`;
            if (a.weakness) context += `Weakness: ${a.weakness}\n`;
            if (a.supplement) context += `Supplement: ${a.supplement}\n`;
        });

        const systemPrompt = `
You are a helpful assistant.
Summarize the user's growth for this month based on their logs (Action Plans, Reflections, Status) and analyses.
Your output must be a valid JSON object with two fields:
1. "content": A detailed summary of activities (3-5 sentences).
2. "summary": A very concise one-line summary (under 20 characters).
Write in Korean.
Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
`;

        const userPrompt = `
Context:
${context}

Draft a yearly overview for ${targetMonth} month.
`;

        const draftJson = await callLLM(systemPrompt, userPrompt);

        let result;
        try {
            // Remove markdown code blocks if present
            const cleanJson = draftJson.replace(/```json/g, '').replace(/```/g, '').trim();
            result = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", draftJson);
            // Fallback if parsing fails
            result = { content: draftJson, summary: "요약 생성 실패" };
        }

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 4. Draft Yearly Result
// POST /api/ai/draft/yearly-result
router.post('/draft/yearly-result', async (req, res) => {
    try {
        const { userId, year, activityContent } = req.body;

        // Fetch all monthly logs for this year
        const monthlyLogs = await MonthlyLog.find({ userId, year }).sort({ month: 1 });

        if (monthlyLogs.length === 0) {
            return res.json({ draft: "해당 연도의 기록이 없습니다." });
        }

        // We need to filter logs relevant to this specific activity.
        // However, MonthlyLog stores activityId. We might need to match by ID if passed, or just text.
        // For simplicity, let's assume we pass the activity text and the AI filters, 
        // OR we pass the activityId if available.
        // Ideally, we should use activityId. But let's see what the client sends.
        // If the client sends activityId, we can filter `monthlyLog.activityLogs`.

        // Let's assume the client sends the activityId (if it's in the plan).
        // But wait, the plan structure might have changed.
        // Let's try to gather ALL logs and ask AI to filter by content similarity if ID isn't easy.
        // Actually, MonthlyLog.activityLogs has `activityId`.
        // So if we pass `activityId`, we can filter exactly.

        const { activityIds } = req.body;

        let relevantLogs = [];
        if (activityIds && Array.isArray(activityIds) && activityIds.length > 0) {
            monthlyLogs.forEach(ml => {
                // Check all activities in this month's log
                ml.activityLogs.forEach(al => {
                    if (activityIds.includes(al.activityId.toString())) {
                        if (al.entries && al.entries.length > 0) {
                            const entriesText = al.entries.map(e => `(Status: ${e.status}) Action: ${e.actionPlan}, Reflection: ${e.reflection}`).join("; ");
                            relevantLogs.push(`[${ml.month}월] ${entriesText}`);
                        } else if (al.log) {
                            relevantLogs.push(`[${ml.month}월] ${al.log}`);
                        }
                    }
                });
            });
        } else {
            return res.json({ draft: "활동 ID 목록이 필요합니다." });
        }

        if (relevantLogs.length === 0) {
            return res.json({ draft: "해당 활동에 대한 월간 기록이 없습니다." });
        }

        const systemPrompt = `
You are a helpful assistant.
Evaluate the yearly outcome of a specific activity based on monthly logs.
Summarize the overall achievement and progress.
Write in Korean.
`;

        const userPrompt = `
Activity: ${activityContent}

Monthly Logs:
${relevantLogs.join("\n")}

Draft a yearly result evaluation.
`;

        const draft = await callLLM(systemPrompt, userPrompt);
        res.json({ draft });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
