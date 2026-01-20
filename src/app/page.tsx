"use client";
import { useState } from 'react';

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [device, setDevice] = useState('空气炸锅');
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false); // 这里定义的是 loading

  const ingredients = ["鸡蛋", "牛奶", "低筋面粉", "砂糖", "淡奶油", "香蕉", "吐司", "酸奶"];

  const handleGenerate = async () => {
    if (selected.length === 0) {
      alert("请至少选择一个原材料哦！");
      return;
    }
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

  const toggleIngredient = (item: string) => {
    // 如果正在加载，则不允许修改
    if (loading) return;
    setSelected(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <main className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-800 mb-8">烘焙实验室 </h1>
      
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <p className="mb-4 font-bold text-gray-700">家里还有什么？</p>
        
        {/* 原材料选择区域 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ingredients.map(item => (
            <button 
              key={item}
              disabled={loading} // 正在查找时禁用原材料按钮
              onClick={() => toggleIngredient(item)}
              className={`px-4 py-2 rounded-full border transition-all ${
                selected.includes(item) 
                  ? 'bg-orange-500 text-white border-orange-500' 
                  : 'bg-white text-gray-600 border-gray-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-300'}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">使用设备:</span>
            <select 
              value={device} 
              disabled={loading}
              onChange={e => setDevice(e.target.value)} 
              className="flex-1 p-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
            >
              <option>空气炸锅</option>
              <option>烤箱</option>
              <option>微波炉</option>
            </select>
          </div>

          {/* 生成按钮 */}
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold transition-all shadow-lg ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed scale-95' 
                : 'bg-orange-600 hover:bg-orange-700 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-lg">⏳</span>
                正在寻找，稍等...
              </span>
            ) : '开始推荐'}
          </button>
        </div>

        {/* 结果显示区域 */}
        {recipe && !loading && (
          <div className="border-t-2 border-orange-100 pt-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-inner p-4 rounded-lg bg-orange-50">
            <h2 className="text-xl font-bold text-orange-900 mb-2">{recipe.title}</h2>
            <div className="bg-white/50 p-3 rounded-md mb-4 border border-orange-100">
              <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                {recipe.steps}
              </p>
            </div>
            <a 
              href={recipe.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors shadow-md"
            >
              去 B站 看视频教学 📺
            </a>
          </div>
        )}
      </div>
    </main>
  );
}