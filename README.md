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

## 📦 本地运行
1. 安装依赖：
```bash
npm install
