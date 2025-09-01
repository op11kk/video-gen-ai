// scripts/testImages.ts
import dotenv from "dotenv";
const result = dotenv.config();

import { generateStoryFromText } from "../lib/generateStoryFromText.ts";
import { generateImagesFromStory } from "../lib/generateImagesFromStory.ts";

const inputText = `
I caught my boyfriend texting his ex last night. He said it was “nothing serious,” just some old memories popping up. But the messages said otherwise.
`;

(async () => {
  const story = await generateStoryFromText(inputText);
  const imagePaths = await generateImagesFromStory(story);
  console.log("✅ 图片保存路径：", imagePaths);
})();
