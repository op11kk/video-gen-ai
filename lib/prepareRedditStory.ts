import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type StorySegment = {
  text: string;      // 用于逐字字幕展示
  narration: string; // 用于 ElevenLabs 配音
};

/**
 * 🧠 使用 GPT-4o 拆分 Reddit 故事为适合视频生成的段落
 * - 每段表达一个完整语义或观点
 * - 控制长度，适合逐帧展示
 * - narration 可略作润色（一般与 text 一致）
 */
export async function prepareRedditStory(fullStory: string): Promise<StorySegment[]> {
  const systemPrompt = `
        You are a precise text segmenter that splits Reddit stories into short display units for TikTok videos.

        🎯 Task:
        Split the user's input Reddit story into a list of short text segments.

        Each segment must:
        - Contain no more than 15 words
        - Preserve the **original wording and tone** (do NOT rewrite or summarize)
        - Follow the original paragraph or bullet point structure
        - Be split at natural pauses (commas, periods, conjunctions, etc.)
        - Be suitable for **on-screen captioning**, where each segment is shown as one animated subtitle block
        - Maintain bullet points if they exist (e.g. "1.", "2.") — each bullet can be split into multiple segments if needed

        Bullet Point Logic:
        - If the input has bullet points (e.g., "1.", "2."), preserve them.
        - If the input looks like a list but **has no bullet points**, infer them and **add "1.", "2.", etc.** accordingly.
        - Treat each bullet item as a separate idea, and split long bullets into multiple short segments (≤15 words).
        - The final output should make the story easier to read **line by line**, as if it were structured bullet points.


        💡 Example Input:

        how to tell if a girl likes you]
        written by a girl (18yr)
        p.s some of these signs may apply to guys as well!!!
        1. we are always looking for u, especially if we’re both in a large crowd of ppl
        2. if she’s shy, she won’t be able to hold eye contact w/ u but if shes extroverted , she’ll stare deeply into ur eyes

        💡 Expected Output (as JSON array of strings):

        [
        "how to tell if a girl likes you]",
        "written by a girl (18yr)",
        "p.s some of these signs may apply to guys as well!!!",
        "1. we are always looking for u,",
        "especially if we’re both in a crowd",
        "2. if she’s shy,",
        "she won’t hold eye contact w/ u",
        "but if she’s extroverted,",
        "she’ll stare deeply into ur eyes"
        ]

        ⚠️ DO NOT rewrite, rephrase, summarize, or inject any commentary. Only split.
        ⚠️ Do not include timestamps or any other metadata.
        ⚠️ Output only the list of strings.
        `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `请处理这个 Reddit 故事：\n\n${fullStory.trim()}` }
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "prepare_story_segments",
          description: "将 Reddit 故事拆分为适合逐帧展示的段落",
          parameters: {
            type: "object",
            properties: {
              segments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string", description: "展示在画面上的原文" },
                    narration: { type: "string", description: "用于配音的文本" }
                  },
                  required: ["text", "narration"]
                }
              }
            },
            required: ["segments"]
          }
        }
      }
    ],
    tool_choice: { type: "function", function: { name: "prepare_story_segments" } }
  });

  const toolCall = completion.choices[0].message.tool_calls?.[0];
  if (!toolCall || toolCall.type !== "function") {
    throw new Error("🛑 OpenAI 未返回 function call");
  }

  try {
    const args = JSON.parse(toolCall.function.arguments);
    return args.segments;
  } catch (err) {
    console.error("❌ JSON 解析失败：", err);
    console.error("🔍 原始返回：", toolCall.function.arguments);
    throw err;
  }
}
