"use client";

import { useState, useRef, useEffect } from "react";
import { Player } from "@/app/page";
import { Trash2, UserPlus, Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RouletteProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  onWinnerSelect: (id: string | null) => void;
  selectedBook: string;
  setSelectedBook: (book: string) => void;
}

const COLORS = [
  "#FFD700", // Vibrant Gold
  "#FF0055", // Vibrant Pink
  "#00FF66", // Vibrant Green
  "#00BFFF", // Vibrant Blue
  "#AA00FF", // Vibrant Purple
  "#FF5500", // Vibrant Orange
];

export default function Roulette({ players, setPlayers, onWinnerSelect, selectedBook, setSelectedBook }: RouletteProps) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  
  const [rotation, setRotation] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (typeof window !== "undefined" && !audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        audioCtxRef.current = new Ctx();
      }
    }
  };

  const playTick = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { id: Date.now().toString(), name: newPlayerName.trim(), score: 0 }]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    if (currentWinner === id) setCurrentWinner(null);
  };

  const spinRoulette = () => {
    if (players.length === 0 || isSpinning) return;
    
    initAudio();
    setIsSpinning(true);
    setCurrentWinner(null);
    onWinnerSelect(null);

    const numPlayers = players.length;
    const sliceAngle = 360 / numPlayers;
    
    // Choose winning player randomly
    const winnerIndex = Math.floor(Math.random() * numPlayers);
    const winner = players[winnerIndex];
    
    const midAngle = winnerIndex * sliceAngle + sliceAngle / 2;
    // Add jitter so it doesn't land exactly in the center of the slice
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.8;
    
    // We want the wheel to spin such that `midAngle` ends up exactly at the top (0 degrees).
    // Our top pointer is at 0 degrees, and the wheel rotates clockwise.
    const targetAbsoluteRotation = 360 - midAngle + jitter;
    
    const currentMod = rotation % 360; 
    let delta = targetAbsoluteRotation - currentMod;
    if (delta < 0) delta += 360;

    const spins = 20;
    const totalRotation = rotation + delta + (360 * spins);

    const startRotation = rotation;
    let startTime: number | null = null;
    const duration = 10000; // 10 seconds spin
    
    let lastTickAngle = startRotation;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      let progress = elapsed / duration;
      
      if (progress > 1) progress = 1;
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentAngle = startRotation + (totalRotation - startRotation) * easeProgress;
      setRotation(currentAngle);

      // determine ticks
      const totalSlicesPassed = Math.floor(currentAngle / sliceAngle);
      const prevSlicesPassed = Math.floor(lastTickAngle / sliceAngle);

      if (totalSlicesPassed > prevSlicesPassed) {
         playTick();
      }
      lastTickAngle = currentAngle;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setCurrentWinner(winner.id);
        onWinnerSelect(winner.id);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col flex-1 space-y-8">
      
      <div className="aspect-square w-full max-w-[280px] md:max-w-[320px] mx-auto relative cursor-pointer" onClick={spinRoulette}>
        <div className="absolute inset-0 rounded-full border-8 border-white/5 shadow-2xl overflow-hidden relative bg-slate-900 pointer-events-none">
          <div style={{ transform: `rotate(${rotation}deg)` }} className="w-full h-full origin-center">
              {players.length > 0 ? (
                 <svg viewBox="-100 -100 200 200" className="w-full h-full block">
                    {players.map((p, idx) => {
                      const numPlayers = players.length;
                      if (numPlayers === 1) {
                         return (
                            <g key={p.id}>
                              <circle cx="0" cy="0" r="100" fill={COLORS[idx % COLORS.length]} />
                              <text x="0" y="0" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">{p.name}</text>
                            </g>
                         )
                      }

                      const angle = 360 / numPlayers;
                      const startAngle = idx * angle;
                      const endAngle = (idx + 1) * angle;

                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      
                      const x1 = Math.cos(startRad) * 100;
                      const y1 = Math.sin(startRad) * 100;
                      const x2 = Math.cos(endRad) * 100;
                      const y2 = Math.sin(endRad) * 100;
                      const largeArc = angle > 180 ? 1 : 0;
                      
                      const midAngle = startAngle + angle / 2;
                      const textRad = (midAngle - 90) * Math.PI / 180;
                      const textX = Math.cos(textRad) * 60;
                      const textY = Math.sin(textRad) * 60;

                      return (
                         <g key={p.id}>
                           <path d={`M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={COLORS[idx % COLORS.length]} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                           <text 
                              x={textX} 
                              y={textY} 
                              fill="white" 
                              fontSize="12" 
                              fontWeight="bold" 
                              textAnchor="middle" 
                              alignmentBaseline="middle"
                              transform={`rotate(${midAngle - 90}, ${textX}, ${textY})`} 
                           >
                             {p.name.length > 12 ? p.name.substring(0, 10) + '...' : p.name}
                           </text>
                         </g>
                      )
                    })}
                 </svg>
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-white/30 text-sm p-4 text-center">
                   Adicione jogadores para preencher a roleta
                 </div>
              )}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center border-4 border-slate-700">
             <div className="w-3 h-3 bg-white/20 rounded-full"></div>
          </div>
        </div>

        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] drop-shadow-lg z-30 pointer-events-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-colors duration-75"
          style={{ 
            borderTopColor: players.length > 0 
              ? COLORS[Math.floor(((360 - (rotation % 360)) % 360) / (360 / players.length)) % COLORS.length] 
              : 'white' 
          }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">
          Placar dos Apóstolos
        </h2>
        
        <div className="flex gap-3 mb-6 items-end">
          <div className="flex-1">
            <input 
              type="text" 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Nome do Jogador..."
              className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (confirm("Tem certeza que deseja zerar todas as pontuações?")) {
                    setPlayers(players.map(p => ({ ...p, score: 0 })));
                  }
                }}
                disabled={players.length === 0}
                title="Zerar Pontuações"
                className="w-[52px] h-[52px] bg-slate-700/50 hover:bg-rose-500/80 border border-white/10 hover:border-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all active:scale-95"
              >
                <RotateCcw size={22} />
              </button>
              <button
                onClick={spinRoulette}
                disabled={isSpinning || players.length === 0}
                title="Girar Roleta"
                className="w-[52px] h-[52px] bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border border-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95"
              >
                {isSpinning ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Play className="fill-current w-6 h-6 ml-1" />
                )}
              </button>
            </div>
            <button 
              onClick={addPlayer}
              title="Adicionar Jogador"
              className="w-full h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center text-white transition-colors active:scale-95"
            >
              <UserPlus size={24} />
            </button>
          </div>
        </div>

        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          <AnimatePresence>
            {players.map((player, idx) => {
              const bgColors = ["bg-amber-500", "bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-cyan-500", "bg-violet-500"];
              const randomBg = bgColors[idx % bgColors.length];
              
              return (
                <motion.li 
                  key={player.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex justify-between items-center p-2 px-3 rounded-xl border ${currentWinner === player.id ? 'bg-indigo-500/30 border-indigo-500/50 shadow-lg scale-[1.02]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'} transition-all overflow-hidden`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-8 h-8 rounded-full ${randomBg} flex items-center justify-center text-xs font-bold shrink-0 text-white`}>
                      {player.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium truncate">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 pointer-events-auto ml-2">
                    <span className="font-mono font-bold text-slate-300">
                      <span className={player.score > 0 ? "text-amber-400" : "text-slate-500"}>{player.score}</span> pts
                    </span>
                    <button 
                      onClick={() => removePlayer(player.id)}
                      className="text-white/30 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {players.length === 0 && (
            <div className="text-center text-white/40 py-4">Nenhum jogador adicionado.</div>
          )}
        </ul>
      </div>

      <div className="pt-4 border-t border-white/10 mt-auto">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
            Novo Desafio: Livro Opcional
          </label>
          <div className="relative">
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-300">Tema Aleatório (Bíblia Toda)</option>
              <optgroup label="Antigo Testamento" className="bg-slate-900 text-slate-400 font-bold">
                <option value="Gênesis" className="text-slate-200">Gênesis</option>
                <option value="Êxodo" className="text-slate-200">Êxodo</option>
                <option value="Levítico" className="text-slate-200">Levítico</option>
                <option value="Números" className="text-slate-200">Números</option>
                <option value="Deuteronômio" className="text-slate-200">Deuteronômio</option>
                <option value="Josué" className="text-slate-200">Josué</option>
                <option value="Juízes" className="text-slate-200">Juízes</option>
                <option value="Rute" className="text-slate-200">Rute</option>
                <option value="1 Samuel" className="text-slate-200">1 Samuel</option>
                <option value="2 Samuel" className="text-slate-200">2 Samuel</option>
                <option value="1 Reis" className="text-slate-200">1 Reis</option>
                <option value="2 Reis" className="text-slate-200">2 Reis</option>
                <option value="1 Crônicas" className="text-slate-200">1 Crônicas</option>
                <option value="2 Crônicas" className="text-slate-200">2 Crônicas</option>
                <option value="Esdras" className="text-slate-200">Esdras</option>
                <option value="Neemias" className="text-slate-200">Neemias</option>
                <option value="Tobias" className="text-slate-200">Tobias</option>
                <option value="Judite" className="text-slate-200">Judite</option>
                <option value="Ester" className="text-slate-200">Ester</option>
                <option value="1 Macabeus" className="text-slate-200">1 Macabeus</option>
                <option value="2 Macabeus" className="text-slate-200">2 Macabeus</option>
                <option value="Jó" className="text-slate-200">Jó</option>
                <option value="Salmos" className="text-slate-200">Salmos</option>
                <option value="Provérbios" className="text-slate-200">Provérbios</option>
                <option value="Eclesiastes" className="text-slate-200">Eclesiastes</option>
                <option value="Cântico dos Cânticos" className="text-slate-200">Cântico dos Cânticos</option>
                <option value="Sabedoria" className="text-slate-200">Sabedoria</option>
                <option value="Eclesiástico" className="text-slate-200">Eclesiástico</option>
                <option value="Isaías" className="text-slate-200">Isaías</option>
                <option value="Jeremias" className="text-slate-200">Jeremias</option>
                <option value="Lamentações" className="text-slate-200">Lamentações</option>
                <option value="Baruque" className="text-slate-200">Baruque</option>
                <option value="Ezequiel" className="text-slate-200">Ezequiel</option>
                <option value="Daniel" className="text-slate-200">Daniel</option>
                <option value="Oseias" className="text-slate-200">Oseias</option>
                <option value="Joel" className="text-slate-200">Joel</option>
                <option value="Amós" className="text-slate-200">Amós</option>
                <option value="Obadias" className="text-slate-200">Obadias</option>
                <option value="Jonas" className="text-slate-200">Jonas</option>
                <option value="Miqueias" className="text-slate-200">Miqueias</option>
                <option value="Naum" className="text-slate-200">Naum</option>
                <option value="Habacuque" className="text-slate-200">Habacuque</option>
                <option value="Sofonias" className="text-slate-200">Sofonias</option>
                <option value="Ageu" className="text-slate-200">Ageu</option>
                <option value="Zacarias" className="text-slate-200">Zacarias</option>
                <option value="Malaquias" className="text-slate-200">Malaquias</option>
              </optgroup>
              <optgroup label="Novo Testamento" className="bg-slate-900 text-slate-400 font-bold">
                <option value="Mateus" className="text-slate-200">Mateus</option>
                <option value="Marcos" className="text-slate-200">Marcos</option>
                <option value="Lucas" className="text-slate-200">Lucas</option>
                <option value="João" className="text-slate-200">João</option>
                <option value="Atos dos Apóstolos" className="text-slate-200">Atos dos Apóstolos</option>
                <option value="Romanos" className="text-slate-200">Romanos</option>
                <option value="1 Coríntios" className="text-slate-200">1 Coríntios</option>
                <option value="2 Coríntios" className="text-slate-200">2 Coríntios</option>
                <option value="Gálatas" className="text-slate-200">Gálatas</option>
                <option value="Efésios" className="text-slate-200">Efésios</option>
                <option value="Filipenses" className="text-slate-200">Filipenses</option>
                <option value="Colossenses" className="text-slate-200">Colossenses</option>
                <option value="1 Tessalonicenses" className="text-slate-200">1 Tessalonicenses</option>
                <option value="2 Tessalonicenses" className="text-slate-200">2 Tessalonicenses</option>
                <option value="1 Timóteo" className="text-slate-200">1 Timóteo</option>
                <option value="2 Timóteo" className="text-slate-200">2 Timóteo</option>
                <option value="Tito" className="text-slate-200">Tito</option>
                <option value="Filemom" className="text-slate-200">Filemom</option>
                <option value="Hebreus" className="text-slate-200">Hebreus</option>
                <option value="Tiago" className="text-slate-200">Tiago</option>
                <option value="1 Pedro" className="text-slate-200">1 Pedro</option>
                <option value="2 Pedro" className="text-slate-200">2 Pedro</option>
                <option value="1 João" className="text-slate-200">1 João</option>
                <option value="2 João" className="text-slate-200">2 João</option>
                <option value="3 João" className="text-slate-200">3 João</option>
                <option value="Judas" className="text-slate-200">Judas</option>
                <option value="Apocalipse" className="text-slate-200">Apocalipse</option>
              </optgroup>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
