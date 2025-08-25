// lib/generateStory.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateStoryFromPrompt(prompt: string) {
  const systemPrompt = `
你是一个创意故事生成器，用户会输入一个prompt（比如“一位女生在火车上遇到消失多年的姐姐”）。

你需要返回一个JSON数组，每个元素都包含以下三项：
- text: 展示在视频上字幕的文字（简洁有情绪）
- narration: 用于语音合成（可与 text 相同）
- image_prompt: 用于生成图像的描述（英文）

注意：
- 总共生成 10 到 15 段
- 不要加入多余说明，不要有开头/结尾文本，直接输出 JSON。
`;

  const userPrompt = `请根据这个提示生成故事结构：${prompt}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-0613",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: "json"
  });

  const story = JSON.parse(response.choices[0].message.content);
  return story;
}
