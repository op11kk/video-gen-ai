import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>视频生成AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">欢迎使用视频生成AI</h1>
        <p className="mt-4">基于AI的视频生成工具</p>
      </main>
    </>
  );
}