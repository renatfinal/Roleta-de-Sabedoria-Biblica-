"use client";

import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { Loader2, HelpCircle, CheckCircle2, XCircle, History, X } from "lucide-react";
import confetti from "canvas-confetti";
import { Player } from "@/app/page";

interface QuestionData {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function BibleTrivia({ 
  selectedPlayer,
  selectedBook,
  onCorrectAnswer
}: { 
  selectedPlayer: Player | null;
  selectedBook: string;
  onCorrectAnswer: () => void;
}) {
  const [qa, setQa] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<QuestionData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const generateQuestion = async () => {
    if (qa) {
      setHistory(prev => [qa, ...prev].slice(0, 5));
    }
    setLoading(true);
    setError("");
    setQa(null);
    setSelectedIndex(null);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Chave da API do Gemini não está configurada.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const bookContext = selectedBook 
        ? `A pergunta DEVE ser especificamente sobre o livro de ${selectedBook}.` 
        : `Escolha aleatoriamente um livro ou tema diferente de toda a Bíblia Católica (composta por 73 livros). É CRUCIAL variar com livros históricos, sapienciais, proféticos, deuterocanônicos e epístolas. Não limite-se apenas a Gênesis, Êxodo ou os quatro Evangelhos.`;
        
      const prompt = `Gere uma pergunta INÉDITA de múltipla escolha sobre a Bíblia. 
Contexto: ${bookContext}
O nível de dificuldade deve ser variado.
A resposta correta deve ser indicada pelo answerIndex (0 a 3). 
O campo explanation deve conter a referência bíblica exata e uma breve explicação gentil.
(Semente de aleatoriedade interna para forçar variação: ${Math.random()})`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "A pergunta a ser feita" },
              options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Quatro opções de resposta" },
              answerIndex: { type: Type.INTEGER, description: "O índice numérico (0 a 3) correspondente à resposta correta no array de opções" },
              explanation: { type: Type.STRING, description: "Breve explicação sobre a resposta correta e a referência bíblica" }
            },
            required: ["question", "options", "answerIndex", "explanation"]
          }
        } 
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.question && Array.isArray(parsed.options) && typeof parsed.answerIndex === "number") {
          setQa(parsed);
        } else {
          throw new Error("Formato inválido retornado pela IA.");
        }
      } else {
        throw new Error("Nenhuma resposta gerada.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("não está configurada")) {
        setError("A chave do Gemini não foi encontrada. Certifique-se de que o Nível gratuito esteja ativado nos Segredos.");
      } else if (err.status === 403 || err.message?.includes("PERMISSION_DENIED") || err.message?.includes("API_KEY_INVALID")) {
        setError("Erro de permissão. Tente fechar e abrir o aplicativo, ou verifique se a chave padrão está habilitada. (Erro: " + err.message + ")");
      } else {
        setError("Houve um erro: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col flex-1 h-full justify-center min-h-[400px] bg-white/10 backdrop-blur-3xl border border-white/20 p-8 md:p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {!showHistory && !loading && (
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
          <button 
            onClick={() => setShowHistory(true)} 
            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95"
            title="Ver Histórico"
          >
            <History size={20} />
          </button>
        </div>
      )}

      {showHistory ? (
        <div className="flex flex-col h-full space-y-6 flex-1 w-full max-h-[600px] animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-serif text-white">Histórico das Perguntas</h3>
            <button 
              onClick={() => setShowHistory(false)} 
              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {history.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-4 text-white/50 h-full">
                <History size={48} className="opacity-20" />
                <p>Nenhuma pergunta no histórico.</p>
              </div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="p-5 bg-black/20 border border-white/5 rounded-2xl space-y-3">
                  <p className="text-white/90 font-serif text-lg leading-snug">{item.question}</p>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-emerald-400 text-sm font-medium leading-tight">
                      {item.options[item.answerIndex]}
                    </p>
                  </div>
                  <p className="text-white/40 text-xs italic border-t border-white/5 pt-2 mt-2">
                    {item.explanation}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          {!qa && !loading && (
            <div className="text-center space-y-6">
          <div className="bg-white/10 p-6 inline-flex rounded-full border border-white/10">
            <HelpCircle size={56} className="text-white/60" strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-serif text-white/90">
               {selectedPlayer ? (
                 <span className="text-amber-400 font-bold">Vez de {selectedPlayer.name}!</span>
               ) : (
                 "Quiz Bíblico"
               )}
             </h2>
             <p className="text-white/50 max-w-sm mx-auto text-lg leading-relaxed">
               Deixe o Espírito guiar a próxima pergunta e teste os conhecimentos sobre a Palavra.
             </p>
          </div>
          <button
             onClick={generateQuestion}
             className="bg-white text-slate-950 hover:bg-amber-50 h-14 px-8 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 mt-4"
          >
             GERAR PERGUNTA
          </button>
          {error && <p className="text-rose-400 text-sm mt-4">{error}</p>}
        </div>
      )}

      {loading && (
        <div className="text-center space-y-5">
          <Loader2 size={56} className="mx-auto text-amber-500 animate-spin" strokeWidth={1.5} />
          <p className="text-slate-400 animate-pulse text-lg font-serif">Buscando sabedoria nas Escrituras...</p>
        </div>
      )}

      {qa && !loading && (
        <div className="w-full space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase border border-amber-500/30 tracking-wide">
                Pergunta {selectedBook ? `sobre ${selectedBook}` : 'do Dia'} {selectedPlayer ? `para ${selectedPlayer.name}` : ''}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif leading-[1.3] text-white/95">
              &quot;{qa.question}&quot;
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {qa.options.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              const isAnswer = qa.answerIndex === idx;
              const hasSelected = selectedIndex !== null;
              
              let style = "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200 cursor-pointer";
              let labelStyle = "bg-slate-800 text-slate-400 group-hover:bg-slate-700";
              
              if (hasSelected) {
                 if (isAnswer) {
                   style = "bg-emerald-500/20 border-emerald-500/30 text-emerald-100 ring-2 ring-emerald-500/20 cursor-default";
                   labelStyle = "bg-emerald-500 text-white";
                 } else if (isSelected && !isAnswer) {
                   style = "bg-rose-500/20 border-rose-500/30 text-rose-100 ring-2 ring-rose-500/20 cursor-default";
                   labelStyle = "bg-rose-500 text-white";
                 } else {
                   style = "bg-white/5 border-white/10 text-slate-500 opacity-50 cursor-default";
                 }
              }

              const letter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <button
                  key={idx}
                  disabled={hasSelected}
                  onClick={() => {
                    setSelectedIndex(idx);
                    if (qa.answerIndex === idx) {
                      onCorrectAnswer();
                      confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#10b981', '#34d399']
                      });
                    }
                  }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center group ${style}`}
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-bold transition-colors shrink-0 ${labelStyle}`}>
                    {letter}
                  </span>
                  <span className="text-lg flex-1">{opt}</span>
                  {hasSelected && isAnswer && <CheckCircle2 size={24} className="text-emerald-500 shrink-0 ml-4" />}
                  {hasSelected && isSelected && !isAnswer && <XCircle size={24} className="text-rose-500 shrink-0 ml-4" />}
                </button>
              );
            })}
          </div>

          {selectedIndex !== null && (
             <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
               <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">Referência Bíblica / Explicação</span>
                   <div className="h-px flex-1 bg-amber-500/20"></div>
                 </div>
                 <p className="text-slate-300 text-sm italic leading-relaxed">
                   {qa.explanation}
                 </p>
               </div>
               
               <div className="flex gap-4">
                 <button
                   onClick={generateQuestion}
                   className="flex-1 bg-white text-slate-950 h-14 rounded-2xl font-bold text-lg shadow-lg hover:bg-amber-50 transition-all active:scale-95"
                 >
                   PRÓXIMA PERGUNTA
                 </button>
               </div>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
}
