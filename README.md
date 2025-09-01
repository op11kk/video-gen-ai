# 🎩 Reddit 故事 + 产品宣传 AI 视频生成器

这是一个 AI 驱动的全自动短视频生成工具。用户只需粘贴一段 Reddit 故事 + 上传一张产品截图，系统将自动生成一条 TikTok 风格竖屏视频：

* 自动朗读 Reddit 故事（AI 配音）
* 每段生成贴合画面的 AI 图像
* 故事文字逐词跳出动画效果（Faceless 视频风格）
* 自动插入产品截图 + 宣传话本 + AI 配音
* 合成 1080x1920 竖屏视频
* 上传到 Supabase，用户可预览、分享

---

## 🚀 功能流程

1. **用户输入**

   * Reddit 故事原文（粘贴）
   * 产品截图（上传）
   * 产品文案（可选，不填则由 AI 生成）

2. **生成步骤**

   * `prepareRedditStory.ts` → Reddit 原文 → 分段化的故事结构
   * `generateVoiceFromStory.ts` → 故事文字 → AI 配音 (ElevenLabs)
   * `generateImagesFromStory.ts` → 每段 → AI 图像 (DALL·E)
   * `generateSubtitlesFromVoice.ts` → 配音 → 逐词字幕 (Whisper)
   * `determineProductInsertion.ts` → 判断插入时机 + 插入位置 + 方式
   * `generateProductInsert.ts` → 生成宣传话本 + AI 配音
   * `composeFinalVideo.ts` → 合成最终视频 (FFmpeg)

3. **上传与记录**

   * `uploadToSupabase.ts` → 上传所有资源到 Supabase Storage
   * `insertVideoRecord.ts` → 将一次视频生成记录写入 Supabase 数据库

---

## 🧠 项目模块责职说明

| 文件                              | 功能                          
| ------------------------------- | --------------------------- 
| `prepareRedditStory.ts`         | 分析 Reddit 原文、分段、生成 story\[] 
| `generateVoiceFromStory.ts`     | 用 ElevenLabs 生成配音           
| `generateImagesFromStory.ts`    | 生成各段的 AI 图像                 
| `generateSubtitlesFromVoice.ts` | 生成逐词跳出字幕 JSON               
| `generateProductInsert.ts`      | 生成产品宣传话本 + AI 配音            
| `determineProductInsertion.ts`  | 判断插入时机和位置                   
| `composeFinalVideo.ts`          | 合成图像 + 配音 + 字幕 + 产品插图       
| `uploadToSupabase.ts`           | 资源文件上传到 Supabase Storage    
| `insertVideoRecord.ts`          | 写入每一条生成记录到 DB               
| `supabase.ts`                   | Supabase JS SDK 封装          

---

## 📅 数据目录说明

| 目录                       | 内容                
| ------------------------ | ----------------- 
| `public/temp/images/`    | 生成的图像 (.png)      
| `public/temp/audio/`     | 配音文件 (.mp3)       
| `public/temp/subtitles/` | 逐词字幕 JSON (.json) 
| `public/temp/promo/`     | 产品截图 + 宣传话本       
| `public/temp/final.mp4`  | 最终合成视频            

---

## 🔐 .env 配置示例

```env
# OpenAI & ElevenLabs API
OPENAI_API_KEY=sk-xxx
ELEVENLABS_API_KEY=xxx
ELEVENLABS_VOICE_ID=xxx

# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

---

## 📂 文件结构 (Cursor 用)

```bash
/
├── app/
│   └── generate/
│       └── page.tsx                      # 用户 UI 页面
│
├── pages/
│   └── api/
│       └── generate.ts                  # 一键视频生成 API
│
├── lib/
│   ├── prepareRedditStory.ts           # 分段创建 story[]
│   ├── generateVoiceFromStory.ts       # 配音生成 (TTS)
│   ├── generateImagesFromStory.ts      # 图像生成 (DALL-E)
│   ├── generateSubtitlesFromVoice.ts   # 逐词字幕 (Whisper)
│   ├── determineProductInsertion.ts    # 插入时机判断 (GPT)
│   ├── generateProductInsert.ts        # 生成宣传话本
│   ├── composeFinalVideo.ts            # FFmpeg 视频合成
│   ├── uploadToSupabase.ts             # Supabase 文件上传
│   ├── insertVideoRecord.ts            # Supabase DB 记录
│   └── supabase.ts                     # Supabase 客户端
│
├── scripts/
│   ├── testStory.ts                    # 测试全路径
│   ├── testImages.ts                   # 测试图像
│   ├── testVoice.ts                    # 测试配音
│   ├── testSubtitles.ts                # 测试字幕
│   ├── testInsertPoint.ts              # 测试插入判断
│   ├── testCompose.ts                  # 合成视频
│   └── seed.ts                         # 批量测试 / 模板
│
├── public/temp/                       # 本地文件输出
│   ├── images/     # 图像
│   ├── audio/      # 音频
│   ├── subtitles/  # 字幕
│   ├── promo/      # 产品图文
│   └── final.mp4   # 最终视频
│
├── .env
├── README.md
├── package.json
└── next.config.js
```

---

## 📊 Supabase 数据表设计

表名：`ai_videos`

| 字段                  | 类型        | 描述                              
| ------------------- | --------- | ------------------------------- 
| `id`                | uuid      | 主键                              
| `reddit_story`      | text      | Reddit 原文                       
| `product_image_url` | text      | 产品截图 URL                        
| `promo_text`        | text      | 宣传话本 (AI 生成)                    
| `voice_url`         | text      | 配音文件 URL                        
| `subtitle_url`      | text      | 字幕 JSON URL                     
| `video_url`         | text      | 合成视频 URL                        
| `status`            | text      | `pending` / `success` / `error` 
| `created_at`        | timestamp | 生成时间                            
