"use client";
import { useState } from 'react';

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [device, setDevice] = useState('空气炸锅');
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ingredients = ["鸡蛋", "牛奶", "低筋面粉", "砂糖", "淡奶油", "香蕉", "吐司", "酸奶", "黄油", "巧克力", "抹茶粉", "芝士"];

  const handleGenerate = async () => {
    if (selected.length === 0) return alert("请选点食材吧，巧妇难为无米之炊呀 ~");
    setLoading(true);
    setRecipe(null);
    try {
      const res = await fetch('/api/baking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selected, device })
      });
      const data = await res.json();
      setRecipe(data);
    } catch (e) {
      alert("哎呀，实验室烤箱断电了（生成失败），请检查网络或刷新重试。");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center p-4 md:p-8 lg:p-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* 标题区 */}
      <div className="relative text-center mb-8 md:mb-12 mt-8 md:mt-12">
        <div className="inline-block mb-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-3 drop-shadow-lg">
            BAKING <span className="block md:inline">LAB</span>
          </h1>
          <div className="h-1.5 w-24 md:w-32 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
        </div>
        <p className="text-purple-700/70 font-medium text-base md:text-lg tracking-wide">
          ✨ 你的 AI 烘焙灵感助手 ✨
        </p>
      </div>
      
      {/* 主卡片 */}
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-purple-200/50 border border-white/50">
        {/* 食材选择 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-300/50"></div>
              <h2 className="font-bold text-gray-800 text-xl md:text-2xl">我的储备粮</h2>
            </div>
            {selected.length > 0 && (
              <span className="ml-auto px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold rounded-full border border-purple-200">
                已选 {selected.length} 种
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3 md:gap-4">
            {ingredients.map(item => (
              <button 
                key={item}
                disabled={loading}
                onClick={() => setSelected(prev => prev.includes(item) ? prev.filter(i => i!==item) : [...prev, item])}
                className={`group relative py-3 md:py-3.5 px-2 text-sm md:text-base rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium ${
                  selected.includes(item) 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400 text-white shadow-lg shadow-purple-300/50 scale-105' 
                    : 'bg-white/80 border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-700'
                } ${loading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {selected.includes(item) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-purple-500 text-xs font-bold shadow-md">
                    ✓
                  </span>
                )}
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 设备选择 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-300/50"></div>
            <h2 className="font-bold text-gray-800 text-xl md:text-2xl">厨具装备</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {['空气炸锅', '烤箱', '微波炉'].map(d => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                disabled={loading}
                className={`relative py-4 md:py-5 rounded-2xl border-2 transition-all duration-300 font-semibold text-base md:text-lg transform hover:scale-105 active:scale-95 ${
                  device === d 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-lg shadow-purple-200/50 scale-105' 
                    : 'border-gray-200 bg-white/60 text-gray-500 hover:border-purple-200 hover:bg-purple-50/30'
                } ${loading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {device === d && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                )}
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* 提交按钮 */}
        <button 
          onClick={handleGenerate} 
          disabled={loading || selected.length === 0}
          className={`group relative w-full py-5 md:py-6 rounded-2xl md:rounded-[2rem] text-white font-black text-lg md:text-xl tracking-wide transition-all duration-300 shadow-2xl overflow-hidden ${
            loading || selected.length === 0
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 active:scale-95 hover:shadow-purple-300/50'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {loading ? (
            <span className="relative flex items-center justify-center gap-3">
              <span className="text-2xl md:text-3xl animate-bounce">🔥</span>
              <span>正在烘焙中...</span>
            </span>
          ) : (
            <span className="relative flex items-center justify-center gap-2">
              <span>开启美味探索</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </span>
          )}
        </button>

        {/* 加载动画 */}
        {loading && !recipe && (
          <div className="mt-12 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <svg className="w-28 h-28 md:w-32 md:h-32 text-purple-500 animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18V9" />
                <circle cx="15" cy="12" r="1.5" fill="currentColor" className="animate-pulse"/>
                <circle cx="9" cy="12" r="1.5" fill="currentColor" className="animate-pulse"/>
              </svg>
              <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg md:text-xl text-gray-700">AI 正在努力烘焙中</p>
              <p className="text-sm md:text-base text-gray-500">美味即将出炉...</p>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}

        {/* 结果展示 */}
        {recipe && !loading && (
          <div className="mt-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200/50 shadow-xl animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent">
                {recipe.title}
              </h3>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-300 shadow-sm">
                ✨ Chef AI
              </span>
            </div>
            <div className="space-y-5">
              <div className="p-5 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl text-gray-700 text-sm md:text-base leading-relaxed shadow-inner border border-purple-100/50">
                <p className="whitespace-pre-line">{recipe.steps}</p>
              </div>
              <a 
                href={recipe.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <span>点击观看视频教程</span>
                <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">📺</span>
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部标识 */}
      <p className="relative mt-8 md:mt-12 text-purple-900/30 text-xs md:text-sm font-bold tracking-widest">
        CREATED BY BAKING LAB AI
      </p>
    </main>
  );
}