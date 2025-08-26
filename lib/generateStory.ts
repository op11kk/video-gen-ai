// lib/generateStory.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateStoryFromPrompt(prompt: string) {
  const systemPrompt = `
    你是一个创意故事生成器，用户会输入一个 prompt（例如“一位女生在火车上遇到消失多年的姐姐”）。

    请根据用户输入生成一个结构化的 JSON 数据（由函数 schema 定义），每个故事段落都包括：
    - text: 展示在视频上字幕的文字（简洁有情绪）
    - narration: 用于语音合成（可与 text 相同）
    - image_prompt: 用于生成图像的英文描述

    要生成 10 到 15 段。不要编写多余说明。
  `;

  const userPrompt = `请根据这个提示生成故事结构：${prompt}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // 或 gpt-4o，但 function_call 兼容
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    functions: [
      {
        name: "generate_story",
        description: "生成一个用于视频内容的结构化故事数组",
        parameters: {
          type: "object",
          properties: {
            story: {
              type: "array",
              description: "故事分段组成的数组，每段都有字幕、语音文案和图像描述",
              items: {
                type: "object",
                properties: {
                  text: { type: "string", description: "字幕文本" },
                  narration: { type: "string", description: "用于语音的文本" },
                  image_prompt: { type: "string", description: "用于图像生成的英文提示语" }
                },
                required: ["text", "narration", "image_prompt"]
              }
            }
          },
          required: ["story"]
        }
      }
    ],
    function_call: { name: "generate_story" } // 指定必须使用这个函数结构返回
  });

  const functionArgs = response.choices[0].message.function_call?.arguments;

  if (!functionArgs) {
    throw new Error("Function call failed: no arguments returned");
  }

  const parsed = JSON.parse(functionArgs);
  return parsed.story;
}
