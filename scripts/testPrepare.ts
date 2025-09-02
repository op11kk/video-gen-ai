import { prepareRedditStory } from "../lib/prepareRedditStory.ts";

// 🧪 输入一个 Reddit 故事进行测试
const sampleStory = `
`;

(async () => {
  try {
    console.log("🚀 开始拆分 Reddit 故事...\n");

    const segments = await prepareRedditStory(sampleStory);

    console.log("✅ 拆分成功，结果如下：\n");
    segments.forEach((seg, i) => {
      console.log(`📍 Segment ${i + 1}`);
      console.log(`📝 text: ${seg.text}`);
      console.log(`🎙️ narration: ${seg.narration}`);
      console.log("---");
    });
  } catch (err) {
    console.error("❌ 测试失败：", err);
  }
})();
