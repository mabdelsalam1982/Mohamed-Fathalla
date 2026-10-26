import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side initialization of Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// JSON Schema for Recruitment Suite
const recruitmentResponseSchema = {
  type: Type.OBJECT,
  properties: {
    jobDescription: {
      type: Type.OBJECT,
      properties: {
        roleTitle: { type: Type.STRING, description: "Official job title" },
        companyName: { type: Type.STRING, description: "Company name or placeholder" },
        location: { type: Type.STRING, description: "Work model and location (e.g. Remote (US/Canada), Hybrid San Francisco, CA)" },
        employmentType: { type: Type.STRING, description: "e.g. Full-Time, Contract" },
        compensation: { type: Type.STRING, description: "Realistic base salary range, bonus, and equity expectations" },
        hook: { type: Type.STRING, description: "Snappy, attention-grabbing 1-2 sentence opening hook for LinkedIn post" },
        aboutTheRole: { type: Type.STRING, description: "2-3 concise paragraphs covering team mission, business impact, and why now" },
        responsibilities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "6-8 action-oriented, outcome-focused responsibilities"
        },
        mustHaveHardSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "5-6 essential technical / domain qualifications"
        },
        mustHaveSoftSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-4 essential behavioral / leadership attributes"
        },
        niceToHaveSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-4 bonus or preferred qualifications"
        },
        whyJoinUs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "4-5 company perks, values, and career growth differentiators"
        },
        linkedInPostFormatted: {
          type: Type.STRING,
          description: "Complete, ready-to-publish LinkedIn post formatted with line breaks, high-signal emojis, bullet points, call-to-action, and relevant hashtags"
        }
      },
      required: [
        "roleTitle", "companyName", "location", "employmentType", "compensation",
        "hook", "aboutTheRole", "responsibilities", "mustHaveHardSkills",
        "mustHaveSoftSkills", "niceToHaveSkills", "whyJoinUs", "linkedInPostFormatted"
      ]
    },
    interviewGuide: {
      type: Type.OBJECT,
      properties: {
        targetRole: { type: Type.STRING },
        seniorityLevel: { type: Type.STRING },
        competencyFocus: {
          type: Type.OBJECT,
          properties: {
            hardSkillsTargeted: { type: Type.ARRAY, items: { type: Type.STRING } },
            softSkillsTargeted: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["hardSkillsTargeted", "softSkillsTargeted"]
        },
        questions: {
          type: Type.ARRAY,
          description: "Exactly 10 behavioral interview questions targeting both hard and soft skills extracted from the JD",
          items: {
            type: Type.OBJECT,
            properties: {
              number: { type: Type.INTEGER, description: "Question index 1 to 10" },
              skillTarget: { type: Type.STRING, description: "Specific skill targeted (e.g. Distributed Consensus, Cross-Functional Conflict, Production Post-Mortems)" },
              skillType: { type: Type.STRING, description: "'hard' or 'soft'" },
              category: { type: Type.STRING, description: "Competency category: e.g. Technical Execution, Collaboration & Influence, Problem Solving, Resilience, Strategic Thinking" },
              jdDirectMapping: { type: Type.STRING, description: "Direct sentence or requirement from the JD this question validates" },
              question: { type: Type.STRING, description: "Behavioral question phrased in the STAR methodology (e.g., 'Tell me about a time when...')" },
              probingQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 targeted follow-up prompts to evaluate depth and prevent scripted answers"
              },
              rubric: {
                type: Type.OBJECT,
                properties: {
                  strongSignal: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 high-performance indicators / green flags"
                  },
                  neutralSignal: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2 average / acceptable indicators"
                  },
                  redFlags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 warning signs / poor candidate indicators"
                  }
                },
                required: ["strongSignal", "neutralSignal", "redFlags"]
              },
              scoringGuidance: { type: Type.STRING, description: "Evaluation notes for scoring candidate 1 (poor) to 5 (exceptional)" }
            },
            required: ["number", "skillTarget", "skillType", "category", "jdDirectMapping", "question", "probingQuestions", "rubric", "scoringGuidance"]
          }
        },
        interviewerDebriefAdvice: {
          type: Type.STRING,
          description: "Strategic advice for hiring committee on calibration, reducing cognitive bias, and making the hiring decision"
        }
      },
      required: ["targetRole", "seniorityLevel", "competencyFocus", "questions", "interviewerDebriefAdvice"]
    }
  },
  required: ["jobDescription", "interviewGuide"]
};

// API: Generate Recruitment Sandbox Outputs
app.post('/api/generate-recruitment', async (req: Request, res: Response) => {
  try {
    const {
      rawNotes,
      roleTitle,
      companyName,
      seniority = 'Senior',
      tone = 'Engaging & Modern',
      workModel = 'Remote / Hybrid',
      modelChoice = 'gemini-4-argon',
      highThinking = true,
    } = req.body;

    if (!rawNotes || typeof rawNotes !== 'string' || !rawNotes.trim()) {
      return res.status(400).json({ error: 'Raw notes about the desired role are required.' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are a Principal Talent Acquisition Partner, Executive Technical Recruiter, and Organizational Psychologist.
Your mission is to take raw, messy, unstructured hiring manager notes and synthesize them into two distinct, world-class recruitment outputs:

1. A polished, high-converting Job Description engineered specifically for LinkedIn:
   - Formatted for maximum candidate engagement and mobile readability.
   - Clear hook, compelling team mission, realistic compensation, quantified responsibilities, distinct Must-Have vs Nice-to-Have qualifications.
   - Also provide 'linkedInPostFormatted': A ready-to-copy LinkedIn post layout with formatting, bullet points, modern emojis, clear CTA, and strategic hashtags.

2. A rigorous Behavioral Interview Guide containing EXACTLY 10 behavioral questions:
   - The 10 questions MUST directly target the specific soft and hard skills established in the newly generated Job Description.
   - Distribute questions evenly across both Hard Skills (technical execution, architecture, domain knowledge, delivery) and Soft Skills (collaboration, conflict resolution, ambiguity, leadership, ownership).
   - Each question must follow STAR behavioral phrasing ("Tell me about a time when...", "Walk me through a situation where...").
   - Include 2-3 probing follow-ups for each question.
   - Provide a granular 3-tier scoring rubric: Strong Signal (Green flags), Neutral Signal (Average), and Red Flags (Warning signs).
   - Ensure questions test real past behavior rather than hypothetical fluff.

Role Context:
- Target Seniority: ${seniority}
- Tone / Style: ${tone}
- Work Model: ${workModel}
${roleTitle ? `- Proposed Title: ${roleTitle}` : ''}
${companyName ? `- Company Name: ${companyName}` : ''}
`;

    const userPrompt = `Here are the raw notes from the hiring manager:
"""
${rawNotes.trim()}
"""

Please synthesize these notes into the complete Recruitment Sandbox suite. Ensure exactly 10 behavioral interview questions that directly map to the hard and soft skills in the generated Job Description.`;

    // Determine target model
    let selectedModel = modelChoice || 'gemini-4-argon';
    if (!['gemini-4-argon', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'].includes(selectedModel)) {
      selectedModel = 'gemini-4-argon';
    }

    // Build configuration
    const config: any = {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: recruitmentResponseSchema,
    };

    if (highThinking && selectedModel === 'gemini-4-argon') {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    } else if (highThinking && selectedModel === 'gemini-3.8-flash') {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    // Multi-model resilience cascade: try selected model, then fallbacks
    const candidateModels: string[] = [selectedModel];
    if (!candidateModels.includes('gemini-3.8-flash')) candidateModels.push('gemini-3.8-flash');
    if (!candidateModels.includes('gemini-3.5-flash')) candidateModels.push('gemini-3.5-flash');
    if (!candidateModels.includes('gemini-3.1-flash-lite')) candidateModels.push('gemini-3.1-flash-lite');

    let response: any = null;
    let actualModelUsed = selectedModel;
    let lastError: any = null;

    for (const modelToTry of candidateModels) {
      const modelConfig: any = {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: recruitmentResponseSchema,
      };

      if (highThinking && (modelToTry === 'gemini-4-argon' || modelToTry === 'gemini-3.8-flash')) {
        modelConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      // Try model (only retry on transient 503, never on 429/404)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: modelToTry,
            contents: userPrompt,
            config: modelConfig,
          });
          actualModelUsed = modelToTry;
          break;
        } catch (err: any) {
          lastError = err;
          console.warn(`Attempt ${attempt} on ${modelToTry} failed:`, err?.status || err?.code || err?.message);
          // If quota exhausted (429) or model not found (404), do not retry the same model
          if (err?.status === 429 || err?.status === 404 || err?.message?.includes('RESOURCE_EXHAUSTED')) {
            break;
          }
          if (attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }

      if (response && response.text) {
        break;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('All model generation attempts failed. Please try again.');
    }

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Gemini returned an empty response.');
    }

    const parsedData = JSON.parse(rawText);

    // Validate that questions array contains exactly 10 questions (or close to it)
    if (parsedData?.interviewGuide?.questions) {
      // Re-index to ensure numbers 1-10 are clean
      parsedData.interviewGuide.questions.forEach((q: any, i: number) => {
        q.number = i + 1;
      });
    }

    return res.json({
      success: true,
      data: parsedData,
      modelUsed: actualModelUsed,
      thinkingMode: highThinking,
    });
  } catch (error: any) {
    console.error('Error generating recruitment outputs:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate recruitment suite',
      details: error.status || error.code || null,
    });
  }
});

// API: Multi-turn Chatbot (Recruiting & Talent Acquisition Copilot)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages,
      context,
      modelChoice = 'gemini-3.8-flash',
      highThinking = false,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getGeminiClient();

    let targetModel = modelChoice || 'gemini-3.8-flash';
    if (!['gemini-4-argon', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'].includes(targetModel)) {
      targetModel = 'gemini-3.8-flash';
    }

    let contextSnippet = '';
    if (context?.jobDescription) {
      contextSnippet += `\nCURRENT GENERATED JOB DESCRIPTION:\nTitle: ${context.jobDescription.roleTitle}\nCompany: ${context.jobDescription.companyName}\nLocation: ${context.jobDescription.location}\nCompensation: ${context.jobDescription.compensation}\nResponsibilities: ${context.jobDescription.responsibilities?.slice(0, 5).join('; ')}\nMust-Have Hard Skills: ${context.jobDescription.mustHaveHardSkills?.join(', ')}\nMust-Have Soft Skills: ${context.jobDescription.mustHaveSoftSkills?.join(', ')}\n`;
    }
    if (context?.interviewGuide?.questions) {
      contextSnippet += `\nCURRENT 10 BEHAVIORAL INTERVIEW QUESTIONS:\n${context.interviewGuide.questions.map((q: any) => `${q.number}. [${q.skillType.toUpperCase()}: ${q.skillTarget}] ${q.question}`).join('\n')}\n`;
    }
    if (context?.rawNotes) {
      contextSnippet += `\nORIGINAL RAW NOTES:\n${context.rawNotes}\n`;
    }

    const systemInstruction = `You are the "Recruitment & Talent Strategy Copilot", an elite Head of Talent Acquisition and Senior Executive Recruiter.
You assist the user in refining, calibrating, tailoring, and operationalizing their hiring process.

Key Responsibilities:
- Review and refine the Job Description (adjusting tone, leveling up or down, tightening requirements, removing biased language).
- Calibrate the 10 behavioral interview questions (adapting them for specific scenario tests, clarifying rubrics, suggesting specific follow-ups).
- Draft personalized LinkedIn Outbound InMails to attract top-tier passive candidates.
- Provide market salary benchmarks, equity advice, and interview loop timelines.
- Formulate take-home challenges, technical screeners, or 30-60-90 day performance milestones.
- Keep answers structured, insightful, recruiter-actionable, and direct.

${contextSnippet ? `You have full visibility into the active sandbox state below:\n${contextSnippet}` : 'No active sandbox JD is generated yet; guide the user on crafting effective notes or recruitment strategy.'}`;

    // Format conversation history for Gemini chat
    // Last message is the current user message
    const historyMessages = messages.slice(0, -1);
    const lastUserMessage = messages[messages.length - 1];

    const history = historyMessages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chatModels: string[] = [targetModel];
    if (!chatModels.includes('gemini-3.8-flash')) chatModels.push('gemini-3.8-flash');
    if (!chatModels.includes('gemini-3.5-flash')) chatModels.push('gemini-3.5-flash');
    if (!chatModels.includes('gemini-3.1-flash-lite')) chatModels.push('gemini-3.1-flash-lite');

    let replyText = '';
    let actualModel = targetModel;
    let chatLastError: any = null;

    for (const modelToTry of chatModels) {
      const chatConfig: any = { systemInstruction };
      if (highThinking && (modelToTry === 'gemini-4-argon' || modelToTry === 'gemini-3.8-flash')) {
        chatConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const chat = ai.chats.create({
            model: modelToTry,
            config: chatConfig,
            ...(history.length > 0 ? { history } : {}),
          });

          const chatResponse = await chat.sendMessage({
            message: lastUserMessage.content,
          });

          replyText = chatResponse.text || '';
          actualModel = modelToTry;
          break;
        } catch (chatError: any) {
          chatLastError = chatError;
          console.warn(`Chat attempt ${attempt} on ${modelToTry} failed:`, chatError?.status || chatError?.message);
          if (chatError?.status === 429 || chatError?.status === 404 || chatError?.message?.includes('RESOURCE_EXHAUSTED')) {
            break;
          }
          if (attempt === 1) {
            await new Promise((r) => setTimeout(r, 400));
          }
        }
      }

      if (replyText) break;
    }

    if (!replyText) {
      throw chatLastError || new Error('Failed to generate chat response.');
    }

    return res.json({
      reply: replyText,
      modelUsed: actualModel,
    });
  } catch (error: any) {
    console.error('Error in recruitment chat:', error);
    res.status(500).json({
      error: error.message || 'Chat service encountered an error',
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('Production dist folder not found. Vite dev middleware used as fallback.');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Recruitment Sandbox Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
