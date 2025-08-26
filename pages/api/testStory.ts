
import type { NextApiRequest, NextApiResponse } from "next";
import {generateStoryFromPrompt} from "../../lib/generateStory"; // 注意路径

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const story = await generateStoryFromPrompt("一个女孩在森林里迷路了，遇到神秘的影子");
    res.status(200).json({ success: true, story });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ success: false, error: (error as any).message });
  }
}