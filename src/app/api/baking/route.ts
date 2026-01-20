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

    const prompt = `你是一位严格的烘焙专家。
用户【仅有】以下食材：${ingredients.join(', ')}。
用户使用的设备是：${device}。

### 约束规则（必须严格遵守）：
1. 推荐的甜品名称必须与提供的食材高度匹配。
2. 严禁使用任何用户未提供的食材（包括砂糖、面粉等调料）。如果食材不足以做任何甜品，请直接返回：{"title": "食材不足", "steps": "很抱歉，目前的食材还差一点点，建议再准备些[缺失食材]。", "videoUrl": "https://www.bilibili.com"}。
3. 如果没有砂糖，请尝试推荐不需要糖的方子（如香蕉吐司）或利用水果本身的甜味。

### 返回格式（JSON）：
{
  "title": "甜品名称",
  "steps": "详细步骤",
  "videoUrl": "B站搜索链接"
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