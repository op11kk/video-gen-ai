// lib/generateImagesFromStory.ts

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateImagesFromStory(
  story: { image_prompt: string }[],
  outputDir: string = "public/temp/images"
) {
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const imagePaths: string[] = [];

  for (let i = 0; i < story.length; i++) {
    const prompt = story[i].image_prompt;
    const filename = `image_${i + 1}_${uuidv4().slice(0, 6)}.png`;
    const filepath = path.join(outputDir, filename);

    console.log(`🖼️ 正在生成第 ${i + 1} 张图像：${prompt}`);

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1536x1024",
        response_format: "url"
      });

      const imageUrl = response.data[0].url;
      const res = await fetch(imageUrl);
      const buffer = Buffer.from(await res.arrayBuffer());

      fs.writeFileSync(filepath, buffer);
      imagePaths.push(filepath);
    } catch (err) {
      console.error(`❌ 第 ${i + 1} 张图像生成失败:`, err);
    }
  }

  return imagePaths;
}
