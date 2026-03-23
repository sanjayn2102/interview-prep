import OpenAI from "openai";

let openaiClient = null;

function getOpenAIClient() {
  if (openaiClient) return openaiClient;
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseJsonFromResponse(text) {
  const direct = parseJson(text);
  if (direct) return direct;

  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/```\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return parseJson(fenced[1]);

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) {
    return parseJson(text.slice(start, end + 1));
  }

  return null;
}

function isFallbackEnabled() {
  return String(process.env.ALLOW_LOCAL_QUESTION_FALLBACK || "").toLowerCase() === "true";
}

function buildLocalFallbackQuestions({ role, level, company, topics = [] }) {
  const focus = topics.length ? topics[0] : "core responsibilities";
  const org = company || "your target organization";
  const safeRole = role || "this role";

  return [
    {
      text: `Introduce yourself and explain why you are a strong fit for the ${safeRole} position.`,
      category: "behavioral",
      difficulty: "easy"
    },
    {
      text: `What are the most important skills required for a ${safeRole}, and how have you applied them in real situations?`,
      category: "role-specific",
      difficulty: "medium"
    },
    {
      text: `Describe a challenging scenario related to ${focus} and how you solved it.`,
      category: "scenario",
      difficulty: "medium"
    },
    {
      text: `How would you prioritize tasks and manage deadlines as a ${safeRole} at ${org}?`,
      category: "situational",
      difficulty: "medium"
    },
    {
      text: `Tell me about a conflict with a teammate or stakeholder and how you resolved it professionally.`,
      category: "behavioral",
      difficulty: "medium"
    },
    {
      text: `If you joined as a ${safeRole}, what would your 30-60-90 day plan look like?`,
      category: "strategy",
      difficulty: "medium"
    },
    {
      text: `How do you measure success and impact in your work as a ${safeRole}?`,
      category: "impact",
      difficulty: "hard"
    },
    {
      text: `What trade-offs would you make when balancing quality, speed, and stakeholder expectations in this role?`,
      category: "decision-making",
      difficulty: "hard"
    }
  ];
}

function buildQuestionPrompt({ role, level, company, topics }) {
  const extraTopics = topics.length ? topics.join(", ") : "none";

  return [
    "Generate exactly 8 interview questions as a JSON array for the role below.",
    `Target role: ${role}`,
    `Seniority: ${level}`,
    `Target company: ${company || "N/A"}`,
    `Priority topics from user: ${extraTopics}`,
    "This role can be technical or non-technical.",
    "Rules:",
    "1) All questions must be role-specific.",
    "2) Include category and difficulty on each item.",
    "3) Use difficulties from: easy, medium, hard.",
    "4) Include at least one behavioral question and at least one scenario-based question.",
    "5) Do not force software engineering or MERN topics unless role demands it.",
    "Return only valid JSON. Schema:",
    '[{"text":"...","category":"...","difficulty":"easy|medium|hard"}]'
  ].join("\n");
}

export async function generateQuestions({ role, level, company, topics = [] }) {
  const openai = getOpenAIClient();
  if (!role || !String(role).trim()) {
    throw new Error("Role is required to generate questions");
  }

  if (!openai) {
    if (isFallbackEnabled()) {
      return buildLocalFallbackQuestions({ role, level, company, topics });
    }
    throw new Error("OPENAI_API_KEY is missing. Add it in server/.env to generate AI questions.");
  }

  const prompt = buildQuestionPrompt({ role, level, company, topics });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an interview coach. Output valid JSON only, no markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });

    const content = completion.choices?.[0]?.message?.content || "[]";
    const parsed = parseJsonFromResponse(content);
    if (!Array.isArray(parsed)) throw new Error("AI returned invalid questions JSON");

    return parsed
      .filter((q) => q && typeof q === "object")
      .map((q) => ({
        text: String(q.text || "").trim(),
        category: String(q.category || "general").trim(),
        difficulty: ["easy", "medium", "hard"].includes(String(q.difficulty || "").toLowerCase())
          ? String(q.difficulty).toLowerCase()
          : "medium"
      }))
      .filter((q) => q.text.length > 0);
  } catch (err) {
    if ((err?.status === 429 || err?.code === "insufficient_quota") && isFallbackEnabled()) {
      return buildLocalFallbackQuestions({ role, level, company, topics });
    }
    throw err;
  }
}

export async function evaluateAnswer({ questionText, answerText, role, level }) {
  const openai = getOpenAIClient();
  if (!openai) {
    return {
      score: 7,
      strengths: ["Clear structure", "Relevant examples"],
      improvements: ["Add measurable outcomes", "Increase technical depth"],
      rewrittenAnswer: `A stronger answer could highlight impact metrics and deeper reasoning.\n\nOriginal intent: ${answerText.slice(0, 120)}...`
    };
  }

  const prompt = `Evaluate this interview answer and return JSON only with keys: score(0-10), strengths(string[]), improvements(string[]), rewrittenAnswer(string).\nRole: ${role}\nLevel: ${level}\nQuestion: ${questionText}\nAnswer: ${answerText}`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: "Return valid JSON only." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3
  });

  const content = completion.choices?.[0]?.message?.content || "{}";
  const parsed = parseJson(content);
  if (!parsed || typeof parsed !== "object") throw new Error("AI returned invalid feedback JSON");

  return {
    score: Math.max(0, Math.min(10, Number(parsed.score ?? 0))),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    rewrittenAnswer: typeof parsed.rewrittenAnswer === "string" ? parsed.rewrittenAnswer : ""
  };
}
