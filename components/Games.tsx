import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Play, 
  Star, 
  RotateCcw, 
  X, 
  Info, 
  HelpCircle, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Target, 
  Sliders, 
  Sparkles,
  Award,
  Volume2
} from 'lucide-react';
import { UserProfile, Game } from '../types';

const GAMES: (Game & { category: string; badge: string; iconName: string })[] = [
  { 
    id: 'quiz', 
    title: 'Sustainable Farming Quiz', 
    description: 'Test your knowledge on organic methods, drip irrigation & IPM to earn bonus XP.', 
    icon: 'HelpCircle', 
    iconName: 'HelpCircle',
    pointsAwarded: 100,
    category: 'Trivia & Knowledge',
    badge: '5 QUESTIONS'
  },
  { 
    id: 'harvest', 
    title: 'Harvest Rush (Crop Catching)', 
    description: 'Fast-paced arcade action. Move your basket to catch ripe crops and avoid pests.', 
    icon: 'Zap', 
    iconName: 'Zap',
    pointsAwarded: 150,
    category: 'Action Arcade',
    badge: '30s SPEED'
  },
  { 
    id: 'spin', 
    title: 'Daily Lucky Harvest Wheel', 
    description: 'Try your luck! Spin the animated 3D wheel daily for surprise farm XP rewards.', 
    icon: 'RotateCcw', 
    iconName: 'RotateCcw',
    pointsAwarded: 250,
    category: 'Daily Reward',
    badge: 'DAILY BONUS'
  },
  { 
    id: 'pest-blaster', 
    title: 'Pest Blaster Arcade', 
    description: 'Tap & spray invading crop pests (locusts, aphids) before they damage your plot!', 
    icon: 'Target', 
    iconName: 'Target',
    pointsAwarded: 180,
    category: 'Reflex Shooter',
    badge: 'PEST DEFENSE'
  },
  { 
    id: 'npk-puzzle', 
    title: 'Soil NPK Nutrient Balancer', 
    description: 'Adjust organic compost & bio-fertilizer sliders to match target crop NPK ratios.', 
    icon: 'Sliders', 
    iconName: 'Sliders',
    pointsAwarded: 200,
    category: 'Puzzle Strategy',
    badge: 'SOIL LAB'
  }
];

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const Games: React.FC<Props> = ({ user, setUser }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const completeGame = (points: number) => {
    setUser(prev => prev ? ({ ...prev, points: prev.points + points }) : null);
    setActiveGame(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-3 max-w-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest border border-emerald-400/30">
              FARMER'S ARCADE HUB
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest border border-amber-400/30">
              100% PLAYABLE MINI-GAMES
            </span>
          </div>
          <h2 className="text-4xl font-black outfit tracking-tight">Interactive Farmer's Arcade</h2>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Sharpen your agricultural reflexes and knowledge with 5 fully interactive games. Earn real XP points to boost your farm level!
          </p>
        </div>

        {/* User Total XP Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center gap-4 z-10 shrink-0">
          <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy size={32} />
          </div>
          <div>
            <p className="text-[10px] text-amber-300 font-black uppercase tracking-widest">Farmer Wallet XP</p>
            <p className="text-3xl font-black text-white outfit">{user.points.toLocaleString()} <span className="text-xs font-normal text-slate-300">XP</span></p>
          </div>
        </div>
      </div>

      {/* Arcade Games Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GAMES.map(game => {
          return (
            <div 
              key={game.id} 
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {game.id === 'quiz' && <HelpCircle size={32} />}
                    {game.id === 'harvest' && <Zap size={32} />}
                    {game.id === 'spin' && <RotateCcw size={32} />}
                    {game.id === 'pest-blaster' && <Target size={32} />}
                    {game.id === 'npk-puzzle' && <Sliders size={32} />}
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-slate-200">
                    {game.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{game.category}</span>
                  <h3 className="text-2xl font-black text-slate-900 outfit leading-snug">{game.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{game.description}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="text-xs font-black text-slate-800">Up to {game.pointsAwarded} XP</span>
                </div>

                <button 
                  onClick={() => setActiveGame(game.id)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Play size={14} fill="currentColor" /> Play Game
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* GAME MODALS */}
      {activeGame === 'quiz' && <QuizGame onComplete={() => completeGame(100)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'harvest' && <HarvestRush onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'spin' && <SpinWheel onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'pest-blaster' && <PestBlasterGame onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
      {activeGame === 'npk-puzzle' && <NPKPuzzleGame onComplete={(pts) => completeGame(pts)} onClose={() => setActiveGame(null)} />}
    </div>
  );
};

/* GAME 1: QUIZ GAME */
const QuizGame = ({ onComplete, onClose }: { onComplete: () => void, onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = [
    { q: "Which micro-irrigation method saves up to 80% water by applying directly to root zones?", a: ["Flood Irrigation", "Drip Irrigation", "Canal Water Overflow"], correct: 1 },
    { q: "What is 'Green Manure' in organic farming?", a: ["Crops like Dhaincha plowed back into soil for nitrogen", "Painted crop seeds", "Synthetic chemical powder"], correct: 0 },
    { q: "What does a Yellow Sticky Trap attract in crop fields?", a: ["Earthworms & Beetles", "Sucking pests like Whiteflies & Aphids", "Rats & Rodents"], correct: 1 },
    { q: "What is the key benefit of crop rotation?", a: ["Breaks pest cycles and restores soil nutrients", "Allows continuous pesticide spraying", "Increases soil erosion"], correct: 0 },
    { q: "Which beneficial micro-organism colonizes root zones to consume fungal wilt pathogens?", a: ["Trichoderma Viride", "Urea Crystals", "Chemical Spray"], correct: 0 }
  ];

  const handleAnswer = (idx: number) => {
    if (idx === questions[step].correct) {
      setScore(s => s + 20);
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 sm:p-10 text-center space-y-6 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100">
          <X size={20} />
        </button>

        {!finished ? (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Question {step + 1} of {questions.length}</span>
              <h3 className="text-2xl font-black text-slate-900 outfit">Sustainability Quiz</h3>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
              <p className="text-lg font-bold text-slate-800 leading-snug">{questions[step].q}</p>
            </div>

            <div className="grid gap-3">
              {questions[step].a.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)} 
                  className="py-3.5 px-5 bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-500 rounded-2xl font-bold text-xs text-slate-800 transition-all cursor-pointer text-left flex items-center justify-between"
                >
                  <span>{opt}</span>
                  <Play size={14} className="text-slate-400" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6 py-4">
            <Trophy size={54} className="text-amber-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-3xl font-black outfit text-slate-900">Quiz Completed!</h3>
              <p className="text-sm font-bold text-slate-600">Your Score: {score} / 100 Points</p>
            </div>
            <button 
              onClick={onComplete} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 cursor-pointer"
            >
              Claim +{score} XP Reward
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* GAME 2: HARVEST RUSH CANVAS GAME */
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
    
    let basketX = canvas.width / 2 - 40;
    const items: {x: number, y: number, speed: number, type: 'crop' | 'pest'}[] = [];
    
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      basketX = Math.max(0, Math.min(canvas.width - 80, e.clientX - rect.left - 40));
    };
    canvas.addEventListener('mousemove', handleMouse);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Field Background lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();

      // Draw Basket
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.roundRect(basketX, canvas.height - 35, 80, 25, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('🧺 HARVEST', basketX + 10, canvas.height - 18);

      // Spawn items
      if (Math.random() < 0.08) {
        items.push({ 
          x: Math.random() * (canvas.width - 30) + 15, 
          y: -10, 
          speed: Math.random() * 2 + 3,
          type: Math.random() > 0.75 ? 'pest' : 'crop' 
        });
      }

      // Update and Draw items
      items.forEach((item, i) => {
        item.y += item.speed;
        
        ctx.beginPath();
        ctx.arc(item.x, item.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = item.type === 'crop' ? '#f59e0b' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw emoji indicator inside circle
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText(item.type === 'crop' ? '🌾' : '🐛', item.x - 6, item.y + 4);

        // Collision Check
        if (item.y > canvas.height - 45 && item.y < canvas.height - 10 && item.x > basketX && item.x < basketX + 80) {
          if (item.type === 'crop') setScore(s => s + 15);
          else setScore(s => Math.max(0, s - 10));
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center space-y-6 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100">
          <X size={20} />
        </button>

        <div className="flex justify-between w-full border-b pb-4 px-2">
          <div className="font-black text-slate-900 outfit text-xl">Score: <span className="text-amber-600">{score}</span></div>
          <div className="font-black text-rose-600 outfit text-xl">Time Left: {timeLeft}s</div>
        </div>

        <canvas ref={canvasRef} width={520} height={360} className="bg-slate-900 rounded-3xl shadow-inner cursor-none w-full" />
        
        {gameOver ? (
          <div className="text-center space-y-4 w-full pt-2">
            <h3 className="text-3xl font-black outfit text-slate-900">Harvest Complete!</h3>
            <p className="text-xs text-slate-500 font-bold">You caught ripe crops and earned {score} XP points.</p>
            <button 
              onClick={() => onComplete(score)} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 cursor-pointer"
            >
              Claim {score} XP
            </button>
          </div>
        ) : (
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Move your mouse left & right to catch 🌾 crops & avoid 🐛 pests</p>
        )}
      </div>
    </div>
  );
};

/* GAME 3: SPIN THE WHEEL GAME */
const SpinWheel = ({ onComplete, onClose }: { onComplete: (pts: number) => void, onClose: () => void }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const newRot = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRot);

    setTimeout(() => {
      const prizes = [50, 100, 150, 200, 250];
      const winPts = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(winPts);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 sm:p-10 text-center space-y-6 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100">
          <X size={20} />
        </button>

        <h3 className="text-2xl font-black text-slate-900 outfit">Lucky Harvest Wheel</h3>

        <div className="relative w-64 h-64 mx-auto my-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20 w-6 h-8 bg-rose-600 rounded-b-xl shadow-lg border-2 border-white pointer-events-none"></div>
          
          <div 
            style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 3s cubic-bezier(0.15, 0.9, 0.25, 1)' }}
            className="w-full h-full rounded-full border-8 border-slate-900 bg-gradient-to-tr from-emerald-600 via-amber-500 to-indigo-600 shadow-2xl flex items-center justify-center relative overflow-hidden"
          >
            <div className="text-center space-y-1 text-white z-10">
              <Sparkles size={36} className="mx-auto text-amber-200" />
              <p className="text-sm font-black uppercase tracking-widest">SPIN WHEEL</p>
            </div>
          </div>
        </div>

        {result !== null ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-900 font-bold text-lg">
              🎉 Congratulations! You won {result} XP!
            </div>
            <button 
              onClick={() => onComplete(result)} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 cursor-pointer"
            >
              Claim Reward
            </button>
          </div>
        ) : (
          <button 
            disabled={spinning}
            onClick={spin}
            className="w-full bg-slate-900 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl cursor-pointer disabled:opacity-50"
          >
            {spinning ? 'Spinning Wheel...' : 'Spin the Wheel'}
          </button>
        )}
      </div>
    </div>
  );
};

/* GAME 4: PEST BLASTER ARCADE */
const PestBlasterGame = ({ onComplete, onClose }: { onComplete: (pts: number) => void, onClose: () => void }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [pests, setPests] = useState<{ id: number; top: number; left: number; type: string }[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setPests(prev => [
        ...prev.slice(-8), 
        {
          id: Date.now() + Math.random(),
          top: Math.floor(Math.random() * 70) + 15,
          left: Math.floor(Math.random() * 80) + 10,
          type: ['🐛', '🦟', '🪲', '🦗'][Math.floor(Math.random() * 4)]
        }
      ]);
    }, 800);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [gameOver]);

  const blastPest = (id: number) => {
    setPests(prev => prev.filter(p => p.id !== id));
    setScore(s => s + 20);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center space-y-6 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100">
          <X size={20} />
        </button>

        <div className="flex justify-between w-full border-b pb-4">
          <div className="font-black text-slate-900 outfit text-xl">Score: <span className="text-violet-600">{score}</span></div>
          <div className="font-black text-rose-600 outfit text-xl">Timer: {timeLeft}s</div>
        </div>

        <div className="relative w-full h-80 bg-gradient-to-b from-amber-50 to-emerald-100 rounded-3xl border-2 border-slate-200 overflow-hidden shadow-inner">
          <div className="absolute inset-x-0 bottom-0 h-12 bg-emerald-700/30 border-t border-emerald-500/40 flex items-center justify-center">
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">🌱 CROP PROTECTION FIELD</span>
          </div>

          {!gameOver && pests.map(p => (
            <button
              key={p.id}
              onClick={() => blastPest(p.id)}
              style={{ top: `${p.top}%`, left: `${p.left}%` }}
              className="absolute text-3xl hover:scale-125 active:scale-90 transition-transform cursor-crosshair animate-bounce"
            >
              {p.type}
            </button>
          ))}
        </div>

        {gameOver ? (
          <div className="text-center space-y-4 w-full">
            <h3 className="text-3xl font-black outfit text-slate-900">Crop Defended!</h3>
            <p className="text-xs text-slate-500 font-bold">You blasted crop pests and earned {score} XP.</p>
            <button 
              onClick={() => onComplete(score)} 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 cursor-pointer"
            >
              Claim {score} XP
            </button>
          </div>
        ) : (
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tap or click invading pests to spray organic neem blast!</p>
        )}
      </div>
    </div>
  );
};

/* GAME 5: SOIL NPK NUTRIENT BALANCER PUZZLE */
const NPKPuzzleGame = ({ onComplete, onClose }: { onComplete: (pts: number) => void, onClose: () => void }) => {
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(30);
  const [potassium, setPotassium] = useState(40);
  const [submitted, setSubmitted] = useState(false);

  // Target values for High-Yield Tomato
  const targetN = 120;
  const targetP = 60;
  const targetK = 100;

  const currentN = 40 + nitrogen * 1.5;
  const currentP = 20 + phosphorus * 1.2;
  const currentK = 30 + potassium * 1.4;

  const accuracyN = 100 - Math.min(100, Math.abs(currentN - targetN));
  const accuracyP = 100 - Math.min(100, Math.abs(currentP - targetP));
  const accuracyK = 100 - Math.min(100, Math.abs(currentK - targetK));
  const totalAccuracy = Math.round((accuracyN + accuracyP + accuracyK) / 3);

  const earnedXp = Math.round(totalAccuracy * 2);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 sm:p-10 space-y-6 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100">
          <X size={20} />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">SOIL LAB PUZZLE</span>
          <h3 className="text-2xl font-black text-slate-900 outfit">Soil NPK Nutrient Balancer</h3>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
          <span>Target Crop: 🍅 Hybrid Tomato</span>
          <span className="text-emerald-700 font-black">Target NPK: {targetN}-{targetP}-{targetK}</span>
        </div>

        {!submitted ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Nitrogen (N) Compost Dosing</span>
                <span className="text-indigo-600 font-black">{Math.round(currentN)} kg/ha</span>
              </div>
              <input 
                type="range" min="0" max="100" value={nitrogen} 
                onChange={(e) => setNitrogen(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Phosphorus (P) Rock Phosphate</span>
                <span className="text-emerald-600 font-black">{Math.round(currentP)} kg/ha</span>
              </div>
              <input 
                type="range" min="0" max="100" value={phosphorus} 
                onChange={(e) => setPhosphorus(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Potassium (K) Bio-Potash Dosing</span>
                <span className="text-amber-600 font-black">{Math.round(currentK)} kg/ha</span>
              </div>
              <input 
                type="range" min="0" max="100" value={potassium} 
                onChange={(e) => setPotassium(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer" 
              />
            </div>

            <button 
              onClick={() => setSubmitted(true)}
              className="w-full bg-slate-900 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg cursor-pointer transition-all"
            >
              Submit Soil NPK Ratio
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-2 text-center">
            <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-6 rounded-3xl border border-indigo-200 space-y-3">
              <h4 className="text-2xl font-black outfit text-slate-900">Soil Balance Accuracy: {totalAccuracy}%</h4>
              <p className="text-xs text-slate-600 font-medium">Your mixed nutrient levels: N: {Math.round(currentN)} | P: {Math.round(currentP)} | K: {Math.round(currentK)}</p>
            </div>

            <button 
              onClick={() => onComplete(earnedXp)} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 cursor-pointer"
            >
              Claim +{earnedXp} XP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
