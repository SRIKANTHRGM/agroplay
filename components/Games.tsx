
import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Play, Star, RotateCcw, X, Info, HelpCircle, CheckCircle2, Zap } from 'lucide-react';
import { UserProfile, Game } from '../types';

const GAMES: Game[] = [
  { id: 'quiz', title: 'Sustainable Farming Quiz', description: 'Test your knowledge on organic methods and earn XP.', icon: 'HelpCircle', pointsAwarded: 50 },
  { id: 'harvest', title: 'Harvest Rush', description: 'Fast-paced arcade action. Catch falling crops and avoid pests.', icon: 'Zap', pointsAwarded: 100 },
  { id: 'spin', title: 'Daily Spin Wheel', description: 'Try your luck! Spin once a day for surprise farming rewards.', icon: 'RotateCcw', pointsAwarded: 250 }
];

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Games: React.FC<Props> = ({ user, setUser }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const completeGame = (points: number) => {
    setUser(prev => ({ ...prev, points: prev.points + points }));
    setActiveGame(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 outfit tracking-tight">Farmer's Arcade</h2>
          <p className="text-slate-500 text-lg">Play interactive mini-games to boost your agricultural skills and earn bonus XP.</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
           <Trophy className="text-amber-500" size={32} />
           <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Game XP</p>
              <p className="text-2xl font-black text-slate-800 outfit">2,450</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GAMES.map(game => (
          <div key={game.id} className="group bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
               {game.id === 'quiz' ? <HelpCircle size={40} /> : game.id === 'harvest' ? <Zap size={40} /> : <RotateCcw size={40} />}
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 outfit">{game.title}</h3>
              <p className="text-slate-500 leading-relaxed">{game.description}</p>
            </div>
            <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Star className="text-amber-500" size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-amber-700">Up to {game.pointsAwarded} XP</span>
               </div>
               <button 
                 onClick={() => setActiveGame(game.id)}
                 className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
               >
                 <Play size={16} fill="currentColor" /> Play Now
               </button>
            </div>
          </div>
        ))}
      </div>

      {activeGame === 'quiz' && <QuizGame onComplete={() => completeGame(50)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'harvest' && <HarvestRush onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'spin' && <SpinWheel onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
    </div>
  );
};

const QuizGame = ({ onComplete, onClose }: { onComplete: () => void, onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const questions = [
    { q: "Which irrigation method saves the most water?", a: ["Drip Irrigation", "Flood Irrigation", "Sprinkler"], correct: 0 },
    { q: "What is 'Green Manure'?", a: ["Painted seeds", "Crops plowed back into soil", "Artificial fertilizer"], correct: 1 }
  ];

  const handleAnswer = (idx: number) => {
    if (idx === questions[step].correct) {
      if (step < questions.length - 1) setStep(step + 1);
      else onComplete();
    } else {
      alert("Oops! Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
        <h3 className="text-3xl font-bold text-slate-800 outfit">Sustainability Quiz</h3>
        <p className="text-slate-400 uppercase font-black text-xs tracking-widest">Question {step + 1} of {questions.length}</p>
        <p className="text-xl font-bold text-slate-700">{questions[step].q}</p>
        <div className="grid gap-4">
          {questions[step].a.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className="py-4 bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 rounded-2xl font-bold text-slate-700 transition-all">{opt}</button>
          ))}
        </div>
        <button onClick={onClose} className="text-slate-400 font-bold text-sm hover:underline">Exit Game</button>
      </div>
    </div>
  );
};

const HarvestRush = ({ onComplete, onClose }: { onComplete: (pts: number) => void, onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationFrame: number;
    
    let basketX = canvas.width / 2;
    const items: {x: number, y: number, type: 'crop' | 'pest'}[] = [];
    
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      basketX = e.clientX - rect.left - 40;
    };
    canvas.addEventListener('mousemove', handleMouse);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Basket
      ctx.fillStyle = '#166534';
      ctx.fillRect(basketX, canvas.height - 30, 80, 20);

      // Spawn items
      if (Math.random() < 0.05) {
        items.push({ x: Math.random() * (canvas.width - 20), y: -20, type: Math.random() > 0.8 ? 'pest' : 'crop' });
      }

      // Update and Draw items
      items.forEach((item, i) => {
        item.y += 4;
        ctx.fillStyle = item.type === 'crop' ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Collision
        if (item.y > canvas.height - 40 && item.x > basketX && item.x < basketX + 80) {
          if (item.type === 'crop') setScore(s => s + 10);
          else setScore(s => Math.max(0, s - 20));
          items.splice(i, 1);
        } else if (item.y > canvas.height) {
          items.splice(i, 1);
        }
      });

      animationFrame = requestAnimationFrame(loop);
    };
    loop();

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(timer);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [gameOver]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 flex flex-col items-center space-y-6">
        <div className="flex justify-between w-full">
           <div className="font-bold text-slate-800 outfit text-2xl">Score: {score}</div>
           <div className="font-bold text-rose-500 outfit text-2xl">{timeLeft}s</div>
        </div>
        <canvas ref={canvasRef} width={500} height={400} className="bg-slate-50 rounded-2xl border border-slate-100 cursor-none" />
        {gameOver ? (
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold outfit">Harvest Complete!</h3>
            <p className="text-slate-500">You earned {score} XP points.</p>
            <button onClick={() => onComplete(score)} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold">Claim XP</button>
          </div>
        ) : (
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Move your mouse to catch falling crops</p>
        )}
        <button onClick={onClose} className="text-slate-400 font-bold text-sm hover:underline">Exit Game</button>
      </div>
    </div>
  );
};

const SpinWheel = ({ onComplete, onClose }: { onComplete: (pts: number) => void, onClose: () => void }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const spin = () => {
    setSpinning(true);
    setTimeout(() => {
      const pts = [50, 100, 150, 200, 250][Math.floor(Math.random() * 5)];
      setResult(pts);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
        <h3 className="text-3xl font-bold text-slate-800 outfit">Lucky Harvest Wheel</h3>
        <div className={`w-64 h-64 bg-slate-100 rounded-full mx-auto border-8 border-white shadow-xl flex items-center justify-center relative ${spinning ? 'animate-spin' : ''}`}>
           <div className="absolute top-0 w-4 h-8 bg-rose-500 -translate-y-1/2 rounded-full" />
           <p className="text-3xl font-black text-slate-400">?</p>
        </div>
        {result ? (
          <div className="space-y-4 animate-in zoom-in-95">
             <CheckCircle2 className="mx-auto text-green-500" size={64} />
             <p className="text-2xl font-bold text-slate-800">You won {result} XP!</p>
             <button onClick={() => onComplete(result)} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold">Claim Reward</button>
          </div>
        ) : (
          <button 
            disabled={spinning}
            onClick={spin}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </button>
        )}
        <button onClick={onClose} className="text-slate-400 font-bold text-sm hover:underline">Exit</button>
      </div>
    </div>
  );
};

export default Games;
