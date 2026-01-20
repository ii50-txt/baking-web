import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  // 即使换了 DeepSeek，我们依然可以用 OpenAI 的这个工具包
  apiKey: process.env.OPENAI_API_KEY, 
  // 关键点：必须加上 DeepSeek 的官方接口地址
  baseURL: "https://api.deepseek.com", 
});

export async function POST(req: Request) {
  try {
    const { ingredients, device } = await req.json();

    const prompt = `你是一位烘焙专家。用户有食材：${ingredients.join(', ')}，使用设备：${device}。
    请推荐一个甜品并以 JSON 格式返回：
    {
      "title": "甜品名称",
      "steps": "极简步骤，包含${device}的具体温度和时间",
      "videoUrl": "https://search.bilibili.com/all?keyword=甜品名+${device}+教程"
    }`;

    const response = await openai.chat.completions.create({
      // 关键点：模型名称改为 deepseek-chat
      model: "deepseek-chat", 
      messages: [{ role: "user", content: prompt }],
      // DeepSeek 也支持强制 JSON 输出
      response_format: { type: "json_object" }
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content!));
  } catch (error: any) {
    // 增加报错打印，方便我们在 PowerShell 看到具体原因
    console.error("DeepSeek 报错详情:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}