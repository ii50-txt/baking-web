"use client";
import { useState } from 'react';

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [device, setDevice] = useState('空气炸锅');
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ingredients = ["鸡蛋", "牛奶", "低筋面粉", "砂糖", "淡奶油", "香蕉", "吐司", "酸奶"];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/baking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selected, device })
      });
      const data = await res.json();
      setRecipe(data);
    } catch (e) {
      alert("生成失败，请检查 API Key 或网络");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-800 mb-8">AI 烘焙实验室 🧁</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <p className="mb-4 font-bold text-gray-700">家里还有什么？</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {ingredients.map(item => (
            <button key={item}
              onClick={() => setSelected(prev => prev.includes(item) ? prev.filter(i => i!==item) : [...prev, item])}
              className={`px-4 py-2 rounded-full border ${selected.includes(item) ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-center mb-6">
          <select value={device} onChange={e => setDevice(e.target.value)} className="p-2 rounded border border-gray-300 bg-white">
            <option>空气炸锅</option>
            <option>烤箱</option>
          </select>
          <button onClick={handleGenerate} disabled={loading || selected.length === 0}
            className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 disabled:bg-gray-300">
            {loading ? "GPT 正在思考..." : "开始推荐"}
          </button>
        </div>

        {recipe && (
          <div className="border-t-2 border-orange-100 pt-4 mt-4 animate-in fade-in shadow-inner p-4 rounded-lg bg-orange-50">
            <h2 className="text-xl font-bold text-orange-900 mb-2">{recipe.title}</h2>
            <p className="text-gray-700 text-sm mb-4 whitespace-pre-line">{recipe.steps}</p>
            <a href={recipe.videoUrl} target="_blank" className="block text-center bg-pink-500 text-white py-2 rounded-lg font-bold hover:bg-pink-600">
              去 B站 看视频教学 📺
            </a>
          </div>
        )}
      </div>
    </main>
  );
}