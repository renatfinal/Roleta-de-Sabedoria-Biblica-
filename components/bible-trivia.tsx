"use client";

import { useState, useEffect } from "react";
import { Loader2, HelpCircle, CheckCircle2, XCircle, History, X, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { Player } from "@/app/page";
import { Language, LocalizedQuestion, getRandomQuestion } from "@/lib/questions";

interface BibleTriviaProps {
  selectedPlayer: Player | null;
  selectedBook: string;
  onCorrectAnswer: () => void;
  language: Language;
}

export default function BibleTrivia({ 
  selectedPlayer,
  selectedBook,
  onCorrectAnswer,
  language
}: BibleTriviaProps) {
  const [qa, setQa] = useState<LocalizedQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<LocalizedQuestion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("bible-trivia-answered");
      if (saved) {
        try {
          setAnsweredIds(JSON.parse(saved));
        } catch (e) {
          setAnsweredIds([]);
        }
      }
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bible-trivia-answered", JSON.stringify(answeredIds));
    }
  }, [answeredIds, isLoaded]);

  const generateQuestion = () => {
    if (qa) {
      setHistory(prev => [qa, ...prev].slice(0, 5));
    }
    setLoading(true);
    setError("");
    setQa(null);
    setSelectedIndex(null);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const questionEntry = getRandomQuestion(language, answeredIds, selectedBook);
      
      if (!questionEntry) {
        if (answeredIds.length > 0) {
          // If we run out of questions, clear history and try again
          setAnsweredIds([]);
          const freshQuestion = getRandomQuestion(language, [], selectedBook);
          if (freshQuestion) {
            setAnsweredIds([freshQuestion.id]);
            setQa(freshQuestion.translations[language]);
          } else {
             setError(strings[language].noQuestions);
          }
        } else {
          setError(strings[language].noQuestions);
        }
      } else {
        setAnsweredIds(prev => [...prev, questionEntry.id]);
        setQa(questionEntry.translations[language]);
      }
      setLoading(false);
    }, 600);
  };

  const strings = {
    pt: {
      historyTitle: "Histórico",
      noHistory: "Nenhuma pergunta no histórico.",
      turnOf: "Vez de",
      title: "Quiz Bíblico",
      desc: "Teste seus conhecimentos. O jogo funciona 100% offline com um banco interno.",
      generateBtn: "NOVA PERGUNTA",
      loading: "Sorteando pergunta...",
      qAbout: "Pergunta sobre",
      qDay: "Pergunta do Dia",
      for: "para",
      ref: "Referência Bíblica",
      nextBtn: "PRÓXIMA",
      noQuestions: "Não temos perguntas para este livro ainda. Tente outro!"
    },
    en: {
      historyTitle: "History",
      noHistory: "No questions in history.",
      turnOf: "Turn of",
      title: "Bible Quiz",
      desc: "Test your knowledge. The game works 100% offline with an internal database.",
      generateBtn: "NEW QUESTION",
      loading: "Drawing question...",
      qAbout: "Question about",
      qDay: "Question of the Day",
      for: "for",
      ref: "Biblical Reference",
      nextBtn: "NEXT",
      noQuestions: "We don't have questions for this book yet. Try another!"
    },
    es: {
      historyTitle: "Historial",
      noHistory: "No hay preguntas en el historial.",
      turnOf: "Turno de",
      title: "Cuestionario Bíblico",
      desc: "Pon a prueba tus conocimientos. Funciona 100% offline con una base de datos interna.",
      generateBtn: "NUEVA PREGUNTA",
      loading: "Sorteando pregunta...",
      qAbout: "Pregunta sobre",
      qDay: "Pregunta del Día",
      for: "para",
      ref: "Referencia Bíblica",
      nextBtn: "SIGUIENTE",
      noQuestions: "Aún no tenemos preguntas para este libro. ¡Intenta con otro!"
    }
  };

  const t = strings[language];

  return (
    <div className="relative flex flex-col flex-1 h-full justify-center min-h-[400px] bg-white/10 backdrop-blur-3xl border border-white/20 p-8 md:p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {!showHistory && !loading && (
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10 flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-semibold">
            <BookOpen size={14} />
            <span>OFFLINE DB</span>
          </div>
          <button 
            onClick={() => setShowHistory(true)} 
            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95"
            title={t.historyTitle}
          >
            <History size={20} />
          </button>
        </div>
      )}

      {showHistory ? (
        <div className="flex flex-col h-full space-y-6 flex-1 w-full max-h-[600px] animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-serif text-white">{t.historyTitle}</h3>
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
                <p>{t.noHistory}</p>
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
                 <span className="text-amber-400 font-bold">{t.turnOf} {selectedPlayer.name}!</span>
               ) : (
                 t.title
               )}
             </h2>
             <p className="text-white/50 max-w-sm mx-auto text-lg leading-relaxed">
               {t.desc}
             </p>
          </div>
          <button
             onClick={generateQuestion}
             className="bg-white text-slate-950 hover:bg-amber-50 h-14 px-8 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 mt-4"
          >
             {t.generateBtn}
          </button>
          {error && <p className="text-rose-400 text-sm mt-4 max-w-md mx-auto">{error}</p>}
        </div>
      )}

      {loading && (
        <div className="text-center space-y-5">
          <Loader2 size={56} className="mx-auto text-amber-500 animate-spin" strokeWidth={1.5} />
          <p className="text-slate-400 animate-pulse text-lg font-serif">{t.loading}</p>
        </div>
      )}

      {qa && !loading && (
        <div className="w-full space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase border border-amber-500/30 tracking-wide">
                {selectedBook ? `${t.qAbout} ${selectedBook}` : t.qDay} {selectedPlayer ? `${t.for} ${selectedPlayer.name}` : ''}
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
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">{t.ref}</span>
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
                   {t.nextBtn}
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
