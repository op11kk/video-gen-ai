// lib/generateStoryFromText.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateStoryFromText(rawText: string) {
  const systemPrompt = `
    你是一个视频脚本生成助手，用户会粘贴一整段故事内容（通常来源于 Reddit 等平台）。
    
    请将这个故事拆解成 10~15 段，每一段都包含：
    - text: 视频字幕显示的内容，短句、有情绪、适合弹幕形式
    - narration: 用于配音，必须和text一致
    - image_prompt: 英文提示词，用于生成这一段图像（可根据段落含义想象画面）

    注意：
    - 每段长度适中，适合 3~6 秒语音
    - 只返回 JSON，不要说明文字
  `;

  const userPrompt = `请处理这个故事：${rawText}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    functions: [
      {
        name: "generate_story",
        description: "拆解文本为视频用的结构化段落",
        parameters: {
          type: "object",
          properties: {
            story: {
              type: "array",
              description: "视频的段落数组",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  narration: { type: "string" },
                  image_prompt: { type: "string" }
                },
                required: ["text", "narration", "image_prompt"]
              }
            }
          },
          required: ["story"]
        }
      }
    ],
    function_call: { name: "generate_story" }
  });

  const functionArgs = response.choices[0].message.function_call?.arguments;
  if (!functionArgs) throw new Error("No function call arguments returned");

  const parsed = JSON.parse(functionArgs);
  return parsed.story;
}
