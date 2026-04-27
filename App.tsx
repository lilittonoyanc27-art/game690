import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Stars, 
  Html, 
  Environment, 
  Float, 
  OrbitControls,
  ContactShadows,
  Text 
} from '@react-three/drei';
import { Physics, useSphere, useBox, usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Heart, 
  Zap, 
  RotateCcw, 
  Play, 
  Target,
  MousePointer2,
  Volume2
} from 'lucide-react';
import { BILLIARDS_QUESTIONS, PEDRITO_COLOR } from './constants';

// --- Physics Components ---

const Table = () => {
  // Table Surface
  const [surfaceRef] = useBox(() => ({ type: 'Static', args: [10, 0.5, 20], position: [0, -0.25, 0] }));
  // Rails
  const [rail1] = useBox(() => ({ type: 'Static', args: [0.5, 1, 20], position: [5.25, 0.25, 0] }));
  const [rail2] = useBox(() => ({ type: 'Static', args: [0.5, 1, 20], position: [-5.25, 0.25, 0] }));
  const [rail3] = useBox(() => ({ type: 'Static', args: [11, 1, 0.5], position: [0, 0.25, 10.25] }));
  const [rail4] = useBox(() => ({ type: 'Static', args: [11, 1, 0.5], position: [0, 0.25, -10.25] }));

  return (
    <group>
      {/* Cloth */}
      <mesh ref={surfaceRef as any} receiveShadow>
        <boxGeometry args={[10, 0.5, 20]} />
        <meshStandardMaterial color="#065f46" roughness={0.8} />
      </mesh>
      {/* Rails visual */}
      <mesh position={[5.25, 0.25, 0]}>
        <boxGeometry args={[0.5, 1, 20.5]} />
        <meshStandardMaterial color="#3f2305" />
      </mesh>
      <mesh position={[-5.25, 0.25, 0]}>
        <boxGeometry args={[0.5, 1, 20.5]} />
        <meshStandardMaterial color="#3f2305" />
      </mesh>
      <mesh position={[0, 0.25, 10.25]}>
        <boxGeometry args={[11, 1, 0.5]} />
        <meshStandardMaterial color="#3f2305" />
      </mesh>
      <mesh position={[0, 0.25, -10.25]}>
        <boxGeometry args={[11, 1, 0.5]} />
        <meshStandardMaterial color="#3f2305" />
      </mesh>
      {/* Pockets (Visual purely for now, collision detection via Y-level or triggers) */}
      {[[-4.8, 0, -9.8], [4.8, 0, -9.8], [-4.8, 0, 9.8], [4.8, 0, 9.8], [-4.8, 0, 0], [4.8, 0, 0]].map((p, i) => (
        <mesh key={i} position={p as any}>
          <cylinderGeometry args={[0.6, 0.6, 0.55]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      ))}
    </group>
  );
};

const Ball = ({ position, label, color, onClick, isCueBall }: { 
  position: [number, number, number], 
  label?: string, 
  color: string, 
  onClick?: () => void,
  isCueBall?: boolean
}) => {
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    position, 
    args: [0.3],
    linearDamping: 0.5,
    angularDamping: 0.5
  }));

  const [hovered, setHovered] = useState(false);
  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe(p => (pos.current = p)), []);

  return (
    <group 
      onPointerOver={() => !isCueBall && setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <mesh ref={ref as any} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.1}
          emissive={hovered ? color : "#000"}
          emissiveIntensity={0.5}
        />
        {label && (
          <Html position={[0, 0.8, 0]} center>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
              className={`
                px-8 py-3 rounded-2xl border-4 font-black transition-all shadow-2xl cursor-pointer pointer-events-auto
                ${hovered ? 'bg-indigo-500 border-white text-white scale-110 shadow-indigo-500/50' : 'bg-white border-indigo-600 text-indigo-950'}
              `}
            >
              {label}
            </motion.div>
          </Html>
        )}
      </mesh>
    </group>
  );
};

const Pedrito = ({ feedback }: { feedback: 'correct' | 'incorrect' | null }) => {
  return (
    <group position={[-6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Float speed={feedback ? 5 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Head */}
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={PEDRITO_COLOR} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 1.2, 0]}>
          <capsuleGeometry args={[0.3, 1, 4, 16]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.4, 1.5, 0]} rotation={[0, 0, feedback === 'correct' ? -Math.PI / 4 : 0.2]}>
          <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
          <meshStandardMaterial color={PEDRITO_COLOR} />
        </mesh>
        <mesh position={[0.4, 1.5, 0]} rotation={[0, 0, feedback === 'correct' ? Math.PI / 4 : -0.2]}>
          <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
          <meshStandardMaterial color={PEDRITO_COLOR} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 2.3, 0.35]}>
          <sphereGeometry args={[0.06]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[0.15, 2.3, 0.35]}>
          <sphereGeometry args={[0.06]} />
          <meshBasicMaterial color="black" />
        </mesh>
        {/* Hat */}
        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[0.1, 0.3, 0.2]} />
          <meshStandardMaterial color="#f43f5e" />
        </mesh>
      </Float>
      
      <Html position={[0, 3, 0]} center>
         <AnimatePresence>
            {feedback && (
               <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className={`px-6 py-3 rounded-2xl font-black text-white shadow-2xl ${feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'}`}
               >
                  {feedback === 'correct' ? '¡Muy bien!' : '¡Oops!'}
               </motion.div>
            )}
         </AnimatePresence>
      </Html>
    </group>
  );
};

// --- Main App ---

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  
  const question = BILLIARDS_QUESTIONS[currentQIndex];

  const handleSelection = (choice: string) => {
    if (feedback) return;

    if (choice === question.target) {
      setFeedback('correct');
      setScore(s => s + 150);
      setTimeout(() => {
        if (currentQIndex >= BILLIARDS_QUESTIONS.length - 1) {
          setIsGameWon(true);
        } else {
          setCurrentQIndex(i => i + 1);
          setFeedback(null);
        }
      }, 2000);
    } else {
      setFeedback('incorrect');
      setLives(l => l - 1);
      if (lives <= 1) {
         setTimeout(() => setIsGameOver(true), 1500);
      }
      setTimeout(() => setFeedback(null), 2000);
    }
  };


  const restart = () => {
    setLives(5);
    setScore(0);
    setCurrentQIndex(0);
    setFeedback(null);
    setIsGameOver(false);
    setIsGameWon(false);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white font-sans overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center max-w-2xl px-12 py-16 rounded-[4rem] bg-indigo-900/30 backdrop-blur-3xl border border-white/10 shadow-2xl">
          <div className="mb-8 inline-block p-6 bg-yellow-500/20 rounded-full animate-bounce">
            <Target className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">POOL WITH PEDRITO</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-[0.4em] mb-12">Grammar Shark Edition</p>
          
          <div className="space-y-4 mb-12 text-left text-lg text-indigo-100/80">
            <p className="flex items-center gap-4">
              <MousePointer2 className="w-5 h-5 text-indigo-400" />
              Aim with the slider and strike the cue ball.
            </p>
            <p className="flex items-center gap-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              Pocket the ball with the correct verb form to score!
            </p>
          </div>

          <button onClick={() => setGameStarted(true)} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-2xl hover:bg-indigo-500 shadow-xl transition-all">LET'S PLAY</button>
        </motion.div>
      </div>
    );
  }

  if (isGameOver || isGameWon) {
    return (
      <div className={`min-h-screen ${isGameWon ? 'bg-emerald-950' : 'bg-rose-950'} flex flex-col items-center justify-center p-8 text-white`}>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-16 rounded-[4rem] bg-black/20 backdrop-blur-3xl border border-white/10">
          <Trophy className={`w-32 h-32 mx-auto mb-8 ${isGameWon ? 'text-yellow-400 animate-bounce' : 'text-rose-500'}`} />
          <h1 className="text-6xl font-black mb-4">{isGameWon ? 'SHARK STATUS!' : 'GAME OVER'}</h1>
          <p className="text-white/60 mb-12 font-bold uppercase tracking-widest leading-relaxed">
            {isGameWon ? 'You mastered Hablar and Decir like a pro!' : 'The table beat you this time.'}
          </p>
          <button onClick={restart} className="px-16 py-5 bg-white text-indigo-900 rounded-3xl font-black text-xl hover:scale-105 transition-all">TRY AGAIN</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 font-sans overflow-hidden">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 18, 12]} fov={55} />
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 10, 0]} intensity={1.5} castShadow />
          <Stars radius={100} depth={50} count={2000} factor={4} />

          <Physics gravity={[0, -9.81, 0]}>
            <Table />
            {/* The Cue Ball */}
            <Ball color="#fff" position={[0, 0.5, 5]} isCueBall />
            
            {/* The Choice Balls */}
            <group position={[0, 0.4, -2]}>
              {question.choices.map((choice, i) => (
                <Ball 
                  key={`${currentQIndex}-${i}`}
                  position={[(i - 0.5) * 5, 0, 0]}
                  color={i === 0 ? "#f43f5e" : "#3b82f6"}
                  label={choice}
                  onClick={() => handleSelection(choice)}
                />
              ))}
            </group>
          </Physics>

          <Pedrito feedback={feedback} />
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col items-center justify-between">
        {/* Top Section: Questions and HUD */}
        <div className="w-full max-w-4xl flex flex-col gap-4 pointer-events-auto">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-rose-500 fill-rose-500" />
                <span className="text-lg md:text-2xl font-black text-white">{lives}</span>
              </div>
              <div className="flex items-center gap-3 md:gap-4 px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-lg md:text-2xl font-black text-white font-mono">{score}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-indigo-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1">Pedrito's Table</div>
              <div className="text-xl md:text-2xl font-black text-white">{currentQIndex + 1} / {BILLIARDS_QUESTIONS.length}</div>
            </div>
          </div>

          {/* The Question Dashboard - Now at the top */}
          <div className="flex flex-col items-center gap-4 w-full">
            <AnimatePresence mode="wait">
              {!feedback ? (
                <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
                  <motion.div 
                    key={currentQIndex}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="bg-indigo-950/80 backdrop-blur-3xl p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 border-indigo-500/30 text-center w-full shadow-[0_0_80px_rgba(79,70,229,0.2)]"
                  >
                    <div className="mb-1 md:mb-2 text-indigo-400 font-black tracking-widest text-[10px] md:text-xs uppercase italic">Complete the phrase:</div>
                    <h2 className="text-xl md:text-4xl font-black text-white mb-2 md:mb-4 leading-tight italic">
                      "{question.prompt}"
                    </h2>
                    <p className="text-indigo-200/60 text-sm md:text-lg font-medium tracking-wide">
                      {question.translation}
                    </p>
                  </motion.div>

                  {/* Mobile Selection Buttons */}
                  <div className="grid grid-cols-2 gap-3 w-full md:hidden">
                    {question.choices.map((choice) => (
                      <button
                        key={choice}
                        onClick={() => handleSelection(choice)}
                        className="bg-white text-indigo-950 p-4 rounded-xl font-black text-lg shadow-xl active:scale-95 transition-transform border-b-4 border-indigo-200"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-8 py-4 md:px-12 md:py-6 rounded-full border-4 ${feedback === 'correct' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.3)]'} flex items-center gap-4 md:gap-6`}
                >
                  {feedback === 'correct' ? <Trophy className="w-8 h-8 md:w-12 md:h-12" /> : <RotateCcw className="w-8 h-8 md:w-12 md:h-12" />}
                  <span className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
                    {feedback === 'correct' ? 'STRIKE!' : 'FOUL!'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Section: Pedrito Avatar */}
        <div className="flex flex-col items-center gap-2 mb-4 md:mb-8 pointer-events-auto">
           <motion.div
             animate={feedback === 'correct' ? { y: [0, -30, 0], scale: [1, 1.1, 1] } : {}}
             transition={{ duration: 0.5 }}
             className="relative"
           >
              {/* CSS Pedrito Avatar */}
              <div className="w-20 h-20 md:w-28 md:h-28 bg-indigo-500 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden flex items-center justify-center relative">
                 <div className="absolute top-2 w-10 h-10 md:w-14 md:h-14 bg-[#fbbf24] rounded-full" /> {/* Head */}
                 <div className="absolute top-12 w-16 h-20 md:w-20 md:h-24 bg-indigo-400 rounded-t-2xl" /> {/* Body */}
                 {/* Face Details */}
                 <div className="absolute top-6 left-6 md:left-9 w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full" />
                 <div className="absolute top-6 right-6 md:right-9 w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full" />
                 <div className="absolute top-10 w-4 h-1 md:w-6 md:h-1.5 bg-rose-400 rounded-full" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-1.5 rounded-lg shadow-lg border border-yellow-600">
                 <Target className="w-4 h-4 text-yellow-900" />
              </div>
           </motion.div>
           <div className="bg-indigo-900/40 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl">
              Shark Pedrito
           </div>
        </div>
      </div>
      
      {/* Visual Instruction Overlay */}
      <div className="absolute bottom-8 right-8 text-indigo-500/30 font-mono text-[10px] uppercase tracking-[0.4em]">
        Engine: BilliardsJS // Pedrito AI v1.0
      </div>
    </div>
  );
}
