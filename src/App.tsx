import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Menu, 
  X, 
  Languages, 
  ArrowRight,
  FileText,
  Megaphone,
  GraduationCap,
  Users,
  Handshake,
  BarChart,
  Gavel,
  Laptop,
  Trophy,
  Building,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, PROMPTS } from './constants';
import { Category, Prompt, Language } from './types';
import { cn, copyToClipboard } from './lib/utils';
import { improvePrompt } from './services/geminiService';

const IconMap: Record<string, React.ReactNode> = {
  FileText: <FileText size={20} />,
  Megaphone: <Megaphone size={20} />,
  GraduationCap: <GraduationCap size={20} />,
  Users: <Users size={20} />,
  Handshake: <Handshake size={20} />,
  BarChart: <BarChart size={20} />,
  Gavel: <Gavel size={20} />,
  Laptop: <Laptop size={20} />,
  Trophy: <Trophy size={20} />,
  Building: <Building size={20} />,
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('ko');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Prompt Improver State
  const [primitivePrompt, setPrimitivePrompt] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [isImproving, setIsImproving] = useState(false);

  const filteredPrompts = useMemo(() => {
    return PROMPTS.filter(p => {
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesSearch = searchQuery 
        ? p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.type.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleImprove = async () => {
    if (!primitivePrompt.trim()) return;
    setIsImproving(true);
    const result = await improvePrompt(primitivePrompt, language);
    setImprovedPrompt(result);
    setIsImproving(false);
  };

  return (
    <div className="flex h-screen bg-[#0a0c10] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-72 bg-[#0d1117] border-r border-slate-800 flex flex-col h-full z-20"
          >
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/40">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="font-bold text-xl tracking-tight leading-tight text-white">ProPrompt <span className="text-indigo-400 italic">Pro</span></h1>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
              <div className="mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                    !selectedCategory ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <div className={cn("p-1.5 rounded-md", !selectedCategory ? "bg-white/20" : "bg-slate-800 text-slate-500")}>
                    <Menu size={16} />
                  </div>
                  <span className="font-bold text-sm tracking-wide">{language === 'ko' ? '전체 라이브러리' : 'All Library'}</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">Categories</p>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group text-sm",
                      selectedCategory === cat.id ? "bg-slate-800 text-white border border-slate-700 shadow-lg" : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-1.5 rounded-lg transition-all duration-300",
                        selectedCategory === cat.id ? "bg-indigo-600 text-white" : "bg-slate-800 group-hover:bg-slate-700 text-slate-500 group-hover:text-slate-300"
                      )}>
                        {IconMap[cat.icon]}
                      </div>
                      <span className="font-semibold truncate max-w-[150px]">
                        {language === 'ko' ? cat.name : cat.nameEn}
                      </span>
                    </div>
                    {selectedCategory === cat.id && <ChevronRight size={14} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-6 border-t border-slate-800 bg-[#0d1117]">
              <div className="flex bg-slate-800 p-1 rounded-full mb-4">
                <button 
                  onClick={() => setLanguage('ko')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-xs font-bold transition-all",
                    language === 'ko' ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                  )}
                >
                  KO
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "flex-1 py-2 rounded-full text-xs font-bold transition-all",
                    language === 'en' ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                  )}
                >
                  EN
                </button>
              </div>
              <p className="text-[10px] text-center font-bold text-slate-600 uppercase tracking-widest">Enterprise Edition</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[#0a0c10] relative overflow-hidden">
        {/* Header bar */}
        <header className="h-20 border-b border-slate-800 bg-[#0d1117] flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <Menu size={24} />
              </button>
            )}
            <div className="relative group w-full max-w-sm hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text"
                placeholder={language === 'ko' ? "키워드 검색..." : "Search prompts..."}
                className="w-full bg-[#161b22] border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600/50 transition-all text-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-900/30 text-indigo-400 rounded-lg border border-indigo-800/50 text-[10px] font-black tracking-widest uppercase">
               Engine: Gemini 3.0 Flash
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 transition-colors">
               <Users size={20} />
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0c10]">
          <div className="max-w-7xl mx-auto p-8 lg:p-12">
            
            {/* AI Prompt Optimizer Section - REDESIGNED PER MOCKUP */}
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <label className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block">AI System</label>
                  <h2 className="text-4xl font-black text-white tracking-tight">
                    {language === 'ko' ? '프롬프트 최적화 엔진' : 'Prompt Optimizer Engine'}
                  </h2>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-600 rounded-lg animate-pulse flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-indigo-400 uppercase tracking-tighter">Ready for processing</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Card */}
                <div className="flex flex-col bg-[#161b22] rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-700 group-focus-within:bg-indigo-600 transition-colors"></div>
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{language === 'ko' ? '프롬프트 입력' : 'Input Prompt'}</label>
                    <span className="px-2.5 py-1 bg-slate-800 text-[10px] font-black text-slate-500 rounded border border-slate-700 uppercase tracking-wider">Draft</span>
                  </div>
                  <textarea 
                    value={primitivePrompt}
                    onChange={(e) => setPrimitivePrompt(e.target.value)}
                    placeholder={language === 'ko' ? "여기에 단순한 요청사항을 입력하세요..." : "Enter your raw instructions here..."}
                    className="flex-1 w-full bg-transparent border-none text-xl leading-relaxed outline-none resize-none placeholder:text-slate-700 min-h-[300px] text-slate-200"
                  />
                  <button 
                    onClick={handleImprove}
                    disabled={isImproving || !primitivePrompt.trim()}
                    className="mt-8 w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 active:scale-[0.98]"
                  >
                    {isImproving ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>{language === 'ko' ? '처리 중...' : 'PROCESSING...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={24} />
                        <span>{language === 'ko' ? '프롬프트 개선하기' : 'IMPROVE PROMPT'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Output Card */}
                <div className="flex flex-col bg-[#161b22] rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-900/50 group-hover:bg-indigo-500 transition-colors"></div>
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{language === 'ko' ? '최적화된 결과' : 'Optimized Output'}</label>
                    <span className="px-2.5 py-1 bg-indigo-900/20 text-[10px] font-black text-indigo-500 rounded border border-indigo-900/40 uppercase tracking-wider">Enhanced</span>
                  </div>
                  
                  <div className="flex-1 h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                    {!improvedPrompt && !isImproving && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 font-bold space-y-4">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-800">
                           <ArrowRight size={40} className="text-slate-700" />
                        </div>
                        <p className="text-lg tracking-tight">{language === 'ko' ? '개선된 프롬프트가 여기에 표시됩니다' : 'Optimized output will appear here'}</p>
                      </div>
                    )}
                    {isImproving && (
                       <div className="space-y-6">
                         <div className="h-5 bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                         <div className="h-5 bg-slate-800 rounded-full w-full animate-pulse"></div>
                         <div className="h-5 bg-slate-800 rounded-full w-5/6 animate-pulse"></div>
                         <div className="h-5 bg-slate-800 rounded-full w-full animate-pulse"></div>
                         <div className="h-5 bg-slate-800 rounded-full w-2/3 animate-pulse"></div>
                         <div className="h-5 bg-slate-800 rounded-full w-4/5 animate-pulse"></div>
                       </div>
                    )}
                    {improvedPrompt && !isImproving && (
                      <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xl prose prose-invert opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                        {improvedPrompt}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleCopy(improvedPrompt, 'enhanced')}
                      disabled={!improvedPrompt || isImproving}
                      className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xl font-black rounded-2xl transition-all flex items-center justify-center gap-3 border border-slate-700 shadow-xl"
                    >
                      {copiedId === 'enhanced' ? (
                        <>
                          <Check size={24} className="text-green-500" />
                          <span>{language === 'ko' ? '복사 완료' : 'COPIED'}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={24} />
                          <span>{language === 'ko' ? '전체 복사 (Copy)' : 'COPY ALL'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full h-px bg-slate-900 mb-20 shadow-sm shadow-black"></div>

            {/* Prompt Library */}
            <section id="library" className="pb-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                <div>
                  <label className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block">Library</label>
                  <h2 className="text-4xl font-black text-white tracking-tight">
                    {language === 'ko' ? '비즈니스 프롬프트 100선' : 'Business 100 Library'}
                  </h2>
                  <p className="text-slate-500 text-xl font-medium mt-2">
                    {selectedCategory 
                      ? (language === 'ko' ? `${CATEGORIES.find(c => c.id === selectedCategory)?.name} 카테고리` : `${CATEGORIES.find(c => c.id === selectedCategory)?.nameEn} Category`)
                      : (language === 'ko' ? '검증된 100가지 현업 필수 템플릿' : '100 validated industry templates')}
                  </p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{language === 'ko' ? '검색됨' : 'Found'}</span>
                  <span className="text-indigo-400 font-black text-2xl">{filteredPrompts.length}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredPrompts.map((prompt) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={prompt.id}
                      className="group bg-[#161b22] border border-slate-800 rounded-[2rem] p-10 hover:border-indigo-500 transition-all duration-500 flex flex-col shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <div className="scale-[3] text-indigo-500">
                            {IconMap[CATEGORIES.find(c => c.id === prompt.category)?.icon || 'FileText']}
                         </div>
                      </div>

                      <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className="flex flex-wrap gap-2.5">
                          <span className="text-[11px] bg-slate-800 text-slate-400 px-3 py-1 rounded-lg font-black tracking-widest uppercase border border-slate-700">#{prompt.id}</span>
                          <span className="text-[11px] bg-indigo-600 text-white px-3 py-1 rounded-lg font-black tracking-widest uppercase shadow-lg shadow-indigo-600/30">{prompt.role}</span>
                          <span className="text-[11px] bg-slate-700 text-slate-200 px-3 py-1 rounded-lg font-black tracking-widest uppercase">{prompt.type}</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(prompt.content, prompt.id)}
                          className={cn(
                            "p-3 rounded-2xl transition-all duration-300",
                            copiedId === prompt.id ? "bg-green-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white"
                          )}
                        >
                          {copiedId === prompt.id ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                      
                      <div className="flex-1 bg-[#0d1117] rounded-3xl p-8 border border-slate-800 group-hover:border-slate-700 transition-colors shadow-inner relative z-10">
                        <p className="text-slate-200 leading-relaxed text-xl font-medium line-clamp-6 group-hover:line-clamp-none transition-all cursor-text select-all">
                          {prompt.content}
                        </p>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-slate-500 relative z-10">
                        <span className="flex items-center gap-2 text-slate-400">
                          {IconMap[CATEGORIES.find(c => c.id === prompt.category)?.icon || 'FileText']}
                          {language === 'ko' ? CATEGORIES.find(c => c.id === prompt.category)?.name : CATEGORIES.find(c => c.id === prompt.category)?.nameEn}
                        </span>
                        <button 
                          onClick={() => {
                            setPrimitivePrompt(prompt.content);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-600/10 px-4 py-2 rounded-full border border-indigo-900/50"
                        >
                          <Sparkles size={14} />
                          {language === 'ko' ? '개선하기 (Improve)' : 'Optimize'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredPrompts.length === 0 && (
                  <div className="col-span-full py-32 text-center space-y-8 bg-[#161b22] rounded-[3rem] border border-slate-800">
                     <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-700 rotate-12">
                        <Search size={48} />
                     </div>
                     <div>
                        <h3 className="text-white font-black text-2xl tracking-tight">{language === 'ko' ? '검색 결과가 없습니다' : 'NO RESULTS FOUND'}</h3>
                        <p className="text-slate-500 text-lg">{language === 'ko' ? '키워드를 다시 확인해주세요.' : 'Try adjusting your search filters.'}</p>
                     </div>
                     <button 
                        onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-full transition-all uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                     >
                        {language === 'ko' ? '전체 초기화' : 'RESET ALL'}
                     </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer Status Bar */}
        <footer className="px-8 py-5 bg-[#0d1117] border-t border-slate-800 flex flex-col sm:flex-row justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] z-10 sticky bottom-0">
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></div>
              Status: System Online
            </span>
            <span className="hidden md:inline">User Identity: Authorized</span>
            <span className="hidden md:inline">Model: Pro-Engine 3.0</span>
          </div>
          <div className="mt-2 sm:mt-0 opacity-40">© 2026 AI PROMPT SYSTEM V2.5.0</div>
        </footer>
      </main>
    </div>
  );
}
