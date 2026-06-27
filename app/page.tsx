"use client";

import { useState, useEffect } from "react";
import Roulette from "@/components/roulette";
import BibleTrivia from "@/components/bible-trivia";
import { Language } from "@/lib/questions";
import { Globe } from "lucide-react";

export interface Player {
  id: string;
  name: string;
  score: number;
  level: number;
  achievements: string[];
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("bible-trivia-players");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure legacy players have a level and achievements
          setPlayers(parsed.map((p: any) => ({ 
            ...p, 
            level: p.level || 1,
            achievements: p.achievements || []
          })));
        } catch (e) {
          setPlayers([
            { id: "1", name: "Jogador 1", score: 0, level: 1, achievements: [] },
            { id: "2", name: "Jogador 2", score: 0, level: 1, achievements: [] },
          ]);
        }
      } else {
        setPlayers([
          { id: "1", name: "Jogador 1", score: 0, level: 1, achievements: [] },
          { id: "2", name: "Jogador 2", score: 0, level: 1, achievements: [] },
        ]);
      }
      
      const savedLang = localStorage.getItem("bible-trivia-lang") as Language;
      if (savedLang && ["pt", "en", "es"].includes(savedLang)) {
        setLanguage(savedLang);
      }
      
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bible-trivia-players", JSON.stringify(players));
      localStorage.setItem("bible-trivia-lang", language);
    }
  }, [players, language, isLoaded]);

  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || null;

  const handleCorrectAnswer = () => {
    if (selectedPlayerId) {
      setPlayers(prev => prev.map(p => {
        if (p.id === selectedPlayerId) {
          const newScore = p.score + 1;
          const newLevel = Math.floor(newScore / 5) + 1; // Level up every 5 points
          
          const newAchievements = p.achievements ? [...p.achievements] : [];
          if (newScore === 1 && !newAchievements.includes("first_blood")) newAchievements.push("first_blood");
          if (newScore === 5 && !newAchievements.includes("apprentice")) newAchievements.push("apprentice");
          if (newScore === 10 && !newAchievements.includes("scholar")) newAchievements.push("scholar");
          if (newScore === 50 && !newAchievements.includes("master")) newAchievements.push("master");

          return { ...p, score: newScore, level: newLevel, achievements: newAchievements };
        }
        return p;
      }));
    }
  };

  const strings = {
    pt: {
      title: "Círculo de",
      subtitle: "Sabedoria",
      desc: "Desafio Bíblico Offline • 73 Livros"
    },
    en: {
      title: "Circle of",
      subtitle: "Wisdom",
      desc: "Offline Bible Challenge • 73 Books"
    },
    es: {
      title: "Círculo de",
      subtitle: "Sabiduría",
      desc: "Desafío Bíblico Offline • 73 Libros"
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 font-sans relative overflow-hidden flex flex-col">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] max-w-[50vw] max-h-[50vw] bg-indigo-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] max-w-[50vw] max-h-[50vw] bg-purple-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] max-w-[30vw] max-h-[30vw] bg-emerald-500/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-4 md:p-8 w-full max-w-7xl mx-auto flex-1">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center bg-white/10 p-1 rounded-full border border-white/20 backdrop-blur-md">
          <Globe className="w-4 h-4 text-white/50 ml-2 mr-1" />
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value as Language)}
            className="bg-transparent text-white/80 text-sm font-semibold outline-none cursor-pointer appearance-none pl-1 pr-3 py-1"
          >
            <option value="pt" className="text-black">PT</option>
            <option value="en" className="text-black">EN</option>
            <option value="es" className="text-black">ES</option>
          </select>
        </div>

        <header className="text-center mb-10 pt-4">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
             {strings[language].title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{strings[language].subtitle}</span>
           </h1>
           <p className="text-slate-400 text-xs md:text-sm uppercase tracking-[0.3em] font-semibold mt-2">
             {strings[language].desc}
           </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start flex-1">
           <section className="col-span-1 lg:col-span-5 flex flex-col space-y-6 h-full">
             <Roulette 
               players={players} 
               setPlayers={setPlayers} 
               onWinnerSelect={setSelectedPlayerId} 
               selectedBook={selectedBook}
               setSelectedBook={setSelectedBook}
               language={language}
             />
           </section>

           <section className="col-span-1 lg:col-span-7 flex flex-col h-full">
             <BibleTrivia 
               selectedPlayer={selectedPlayer} 
               selectedBook={selectedBook}
               onCorrectAnswer={handleCorrectAnswer} 
               language={language}
             />
           </section>
        </div>
      </div>
    </main>
  )
}
