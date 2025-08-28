# 📽️ AI 视频自动生成工具

## 🚀 项目目标
输入一个 Prompt，自动生成 1~1.5 分钟的短视频，包含：
- 故事情节（GPT 生成）
- 插图背景（DALL·E / SD）
- 语音讲述（ElevenLabs）
- 同步弹字字幕
- 多图切换 + 合成视频

## 🧱 技术栈
- Next.js (前端 + API Route)
- Supabase (数据存储)
- FFmpeg (合成视频)
- OpenAI API
- ElevenLabs API

## 📁 项目结构说明
- `lib/`：AI 调用逻辑（生成故事、图像、语音、字幕）
- `api/`：视频生成总调度入口
- `public/temp/`：临时保存生成的素材 & 输出视频
- `utils/ffmpeg.ts`：封装 FFmpeg 合成功能

video-gen-ai/
├── public/
│   └── temp/                   # 存放中间生成的图片、音频、视频
├── pages/
│   └── index.tsx               # 主界面：输入 Prompt + 显示结果
├── lib/
│   ├── generateStory.ts        # 调用 OpenAI 生成故事内容
│   ├── generateImages.ts       # 调用图像生成 API（如 DALL·E）
│   ├── generateVoice.ts        # 调用 ElevenLabs 生成配音
│   ├── generateSubtitles.ts    # 生成逐字弹出的字幕 JSON / SRT
│   └── composeVideo.ts         # 调用 FFmpeg 将图+音+字幕合成视频
├── api/
│   └── generate.ts             # 主 API：调度所有步骤 + 返回视频地址
├── utils/
│   └── ffmpeg.ts               # FFmpeg 执行封装（spawn 等）
├── supabase/                   # Supabase 连接配置 & 表结构
├── .env.local                  # 存放 API key 的本地环境变量
├── package.json
├── README.md                   # 项目介绍说明文档


## 📦 本地运行
1. 安装依赖：
```bash
npm install
