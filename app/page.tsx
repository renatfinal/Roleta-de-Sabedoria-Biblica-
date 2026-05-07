"use client";

import { useState, useEffect } from "react";
import Roulette from "@/components/roulette";
import BibleTrivia from "@/components/bible-trivia";

export interface Player {
  id: string;
  name: string;
  score: number;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bible-trivia-players");
    if (saved) {
      try {
        setPlayers(JSON.parse(saved));
      } catch (e) {
        setPlayers([
          { id: "1", name: "Jogador 1", score: 0 },
          { id: "2", name: "Jogador 2", score: 0 },
        ]);
      }
    } else {
      setPlayers([
        { id: "1", name: "Jogador 1", score: 0 },
        { id: "2", name: "Jogador 2", score: 0 },
      ]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bible-trivia-players", JSON.stringify(players));
    }
  }, [players, isLoaded]);

  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || null;

  const handleCorrectAnswer = () => {
    if (selectedPlayerId) {
      setPlayers(prev => prev.map(p => 
        p.id === selectedPlayerId ? { ...p, score: p.score + 1 } : p
      ));
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
        <header className="text-center mb-10 pt-4">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
             Círculo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Sabedoria</span>
           </h1>
           <p className="text-slate-400 text-xs md:text-sm uppercase tracking-[0.3em] font-semibold mt-2">
             Desafio Bíblico Interativo • IA Powered
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
             />
           </section>

           <section className="col-span-1 lg:col-span-7 flex flex-col h-full">
             <BibleTrivia 
               selectedPlayer={selectedPlayer} 
               selectedBook={selectedBook}
               onCorrectAnswer={handleCorrectAnswer} 
             />
           </section>
        </div>
      </div>
    </main>
  )
}
