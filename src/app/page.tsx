"use client";
import { useState } from 'react';

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [device, setDevice] = useState('空气炸锅');
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ingredients = ["鸡蛋", "牛奶", "低筋面粉", "砂糖", "淡奶油", "香蕉", "吐司", "酸奶"];

  const handleGenerate = async () => {
    if (selected.length === 0) return alert("请选点食材吧，巧妇难为无米之炊呀 ~");
    setLoading(true);
    setRecipe(null); // 清空旧结果，增加仪式感
    try {
      const res = await fetch('/api/baking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selected, device })
      });
      const data = await res.json();
      setRecipe(data);
    } catch (e) {
      alert("哎呀，实验室烤箱断电了（生成失败）");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-4 md:p-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100 via-orange-50 to-white flex flex-col items-center">
      {/* 标题区 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-orange-900 tracking-tight mb-2">
          BAKING <span className="text-orange-500">LAB</span>
        </h1>
        <p className="text-orange-700/60 font-medium">—— 你的 AI 烘焙灵感助手 ——</p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(251,146,60,0.15)] w-full max-w-lg border border-white">
        {/* 食材选择 */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
            <h2 className="font-bold text-gray-800 text-lg">我的储备粮</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {ingredients.map(item => (
              <button 
                key={item}
                disabled={loading}
                onClick={() => setSelected(prev => prev.includes(item) ? prev.filter(i => i!==item) : [...prev, item])}
                className={`py-2 text-sm rounded-2xl border-2 transition-all duration-300 ${
                  selected.includes(item) 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 scale-105' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200'
                } ${loading ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 设备选择 */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
            <h2 className="font-bold text-gray-800 text-lg">厨具装备</h2>
          </div>
          <div className="flex gap-3">
            {['空气炸锅', '烤箱', '微波炉'].map(d => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                disabled={loading}
                className={`flex-1 py-3 rounded-2xl border-2 transition-all ${
                  device === d ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold' : 'border-gray-100 text-gray-400'
                } ${loading ? 'opacity-40' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* 提交按钮 */}
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className={`w-full py-5 rounded-[2rem] text-white font-black text-lg tracking-widest transition-all shadow-xl active:scale-95 ${
            loading ? 'bg-gray-300' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
          }`}
        >
          {loading ? '正在研发独家配方...' : '开启美味探索'}
        </button>

        {/* 结果呈现 */}
        {recipe && !loading && (
          <div className="mt-10 p-6 rounded-[2rem] bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50 animate-in slide-in-from-top-4 fade-in duration-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-black text-orange-900">{recipe.title}</h3>
              <span className="bg-orange-200 text-orange-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Chef AI</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-2xl text-gray-700 text-sm leading-relaxed shadow-sm">
                <p className="whitespace-pre-line">{recipe.steps}</p>
              </div>
              <a 
                href={recipe.videoUrl} 
                target="_blank" 
                className="flex items-center justify-center gap-2 w-full bg-[#fb7299] text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:brightness-105 transition-all"
              >
                <span>点击观看视频教程</span>
                <span className="text-xl">📺</span>
              </a>
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-orange-900/20 text-xs font-bold tracking-[0.2em]">CREATED BY BAKING LAB AI</p>
    </main>
  );
}