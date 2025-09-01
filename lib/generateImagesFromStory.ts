import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type StorySegment = {
  image_prompt: string;
  text: string;
  narration: string;
};

type GenerationOptions = {
  outputDir?: string;
  imageSize?: "1024x1024" | "1024x1792";
  saveToSupabase?: boolean;
};

export async function generateImagesFromStory(
  story: StorySegment[],
  options?: GenerationOptions
): Promise<
  {
    localPath: string;
    publicUrl?: string;
  }[]
> {
  const outputDir = options?.outputDir || "public/temp/images";
  const imageSize = options?.imageSize || "1024x1792";

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = [];

  for (let i = 0; i < story.length; i++) {
    const prompt = story[i].image_prompt;
    const filename = `image_${i + 1}_${uuidv4().slice(0, 6)}.png`;
    const filepath = path.join(outputDir, filename);

    console.log(`🎨 正在生成第 ${i + 1} 张图像...`);
    console.log(`🧠 Prompt: ${prompt}`);

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: imageSize,
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) throw new Error("Image URL is undefined");

      // ✅ 直接使用 Node.js 原生 fetch（无需 node-fetch）
      const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());
      fs.writeFileSync(filepath, Buffer.from(imageBuffer));

      results.push({
        localPath: filepath,
        publicUrl: undefined,
      });

      console.log(`✅ 第 ${i + 1} 张图像保存完成：${filepath}`);
    } catch (err) {
      console.error(`❌ 图像生成失败（第 ${i + 1} 段）：`, err);
    }
  }

  return results;
}
