/**
 *
 * src/app/grid/Grid.js
 *
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { generateCrashPoint } from "../../utils/crashAlgorithm";
import { GameCanvas } from "../canvas/Canvas";

export default function Grid({ balance, setBalance }) {
  // Game state
  const [gameState, setGameState] = useState("WAITING"); // 'WAITING' | 'RUNNING' | 'CRASHED'
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(1.0);
  const [countdown, setCountdown] = useState(5);
  const [history, setHistory] = useState([1.45, 2.1, 1.05, 12.4, 1.88, 3.5, 1.12]);

  // Player Bet state
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(1.4);
  const [hasBetted, setHasBetted] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashedOutAt, setCashedOutAt] = useState(null);
  const [winAmount, setWinAmount] = useState(0);

  // Sync state refs for requestAnimationFrame loop
  const animationRef = useRef(null);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const multiplierRef = useRef(multiplier);
  multiplierRef.current = multiplier;
  const hasBettedRef = useRef(hasBetted);
  hasBettedRef.current = hasBetted;
  const hasCashedOutRef = useRef(hasCashedOut);
  hasCashedOutRef.current = hasCashedOut;
  const autoCashoutRef = useRef(autoCashout);
  autoCashoutRef.current = autoCashout;

  // Actions
  const handleCashOut = useCallback(
    (targetMult = null) => {
      if (!hasBettedRef.current || hasCashedOutRef.current || gameStateRef.current !== "RUNNING")
        return;

      const mult = targetMult || multiplierRef.current;
      const payout = parseFloat((betAmount * mult).toFixed(2));

      setBalance((prev) => parseFloat((prev + payout).toFixed(2)));
      setHasCashedOut(true);
      setCashedOutAt(mult);
      setWinAmount(payout);
    },
    [betAmount, setBalance],
  );

  const handlePlaceBet = () => {
    if (balance < betAmount || betAmount <= 0) return;
    setBalance((prev) => parseFloat((prev - betAmount).toFixed(2)));
    setHasBetted(true);
  };

  // State 1: WAITING Countdown Phase
  useEffect(() => {
    let interval;
    if (gameState === "WAITING") {
      setMultiplier(1.0);
      setHasCashedOut(false);
      setCashedOutAt(null);
      setWinAmount(0);

      const targetCrash = generateCrashPoint();
      setCrashPoint(targetCrash);

      setCountdown(5);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameState("RUNNING");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // State 2: RUNNING Exponential Loop
  useEffect(() => {
    if (gameState !== "RUNNING") return;

    const startTime = Date.now();

    const updateLoop = () => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const currentMult = Math.max(1.0, parseFloat(Math.exp(0.08 * elapsedSeconds).toFixed(2)));

      if (currentMult >= crashPoint) {
        setMultiplier(crashPoint);
        setGameState("CRASHED");
        setHistory((prev) => [crashPoint, ...prev.slice(0, 9)]);

        if (hasBettedRef.current && !hasCashedOutRef.current) {
          setHasBetted(false);
        }

        setTimeout(() => {
          setHasBetted(false);
          setGameState("WAITING");
        }, 3000);
        return;
      }

      setMultiplier(currentMult);

      if (
        hasBettedRef.current &&
        !hasCashedOutRef.current &&
        autoCashoutRef.current > 1.0 &&
        currentMult >= autoCashoutRef.current
      ) {
        handleCashOut(autoCashoutRef.current);
      }

      animationRef.current = requestAnimationFrame(updateLoop);
    };

    animationRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, crashPoint, handleCashOut]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pt-24 pb-16">
      {/* Main Content Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 max-w-7xl w-full mx-auto">
        {/* Left: Control Panel */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-6 order-2 lg:order-1">
          <div className="space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Betting Controls
            </h2>

            {/* Bet Input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Bet Amount ($)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  disabled={hasBetted && gameState !== "CRASHED"}
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  disabled={hasBetted && gameState !== "CRASHED"}
                  onClick={() => setBetAmount((prev) => parseFloat((prev / 2).toFixed(2)))}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-3 py-2 rounded-xl text-xs font-bold"
                >
                  ½
                </button>
                <button
                  disabled={hasBetted && gameState !== "CRASHED"}
                  onClick={() => setBetAmount((prev) => parseFloat((prev * 2).toFixed(2)))}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-3 py-2 rounded-xl text-xs font-bold"
                >
                  2×
                </button>
              </div>
            </div>

            {/* Auto Cashout Input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Auto Cashout Multiplier</label>
              <input
                type="number"
                step="0.1"
                disabled={hasBetted && gameState !== "CRASHED"}
                value={autoCashout}
                onChange={(e) => setAutoCashout(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Action Button */}
          <div>
            {gameState === "WAITING" && (
              <button
                onClick={handlePlaceBet}
                disabled={hasBetted || balance < betAmount}
                className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wide transition-all shadow-lg ${
                  hasBetted
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50 active:scale-[0.98]"
                }`}
              >
                {hasBetted ? "Bet Placed..." : "Place Bet"}
              </button>
            )}

            {gameState === "RUNNING" && (
              <button
                onClick={() => handleCashOut()}
                disabled={!hasBetted || hasCashedOut}
                className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wide transition-all shadow-lg ${
                  hasCashedOut
                    ? "bg-emerald-950/80 border border-emerald-800 text-emerald-400 cursor-default"
                    : hasBetted
                      ? "bg-amber-400 hover:bg-amber-300 text-slate-950 animate-pulse shadow-amber-950/50 active:scale-[0.98]"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {hasCashedOut
                  ? `Cashed Out @ ${cashedOutAt?.toFixed(2)}x`
                  : hasBetted
                    ? `Cash Out ($${(betAmount * multiplier).toFixed(2)})`
                    : "Game In Progress"}
              </button>
            )}

            {gameState === "CRASHED" && (
              <button
                disabled
                className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-wide bg-rose-950/50 border border-rose-900 text-rose-500 cursor-not-allowed"
              >
                Crashed @ {multiplier.toFixed(2)}x
              </button>
            )}
          </div>
        </section>

        {/* Right: Graph Display & History */}
        <section className="lg:col-span-3 flex flex-col gap-4 order-1 lg:order-2">
          {/* Recent Multipliers Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider pr-2 border-r border-slate-800">
              History
            </span>
            <div className="flex gap-2">
              {history.map((val, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                    val >= 2.0
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {val.toFixed(2)}x
                </span>
              ))}
            </div>
          </div>

          {/* Graph Display Area */}
          <div className="relative flex-1 bg-slate-900 border border-slate-800 rounded-2xl min-h-[380px] overflow-hidden">
            {/* Canvas Layer */}
            <GameCanvas gameState={gameState} multiplier={multiplier} />

            {/* Overlay Multiplier Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              {gameState === "WAITING" && (
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-1">
                    Next Round Starts In
                  </p>
                  <p className="text-6xl font-black text-white tracking-tight">{countdown}s</p>
                </div>
              )}

              {gameState === "RUNNING" && (
                <div className="text-center">
                  <p className="text-7xl font-black text-white tracking-tight drop-shadow-md">
                    {multiplier.toFixed(2)}
                    <span className="text-emerald-400">x</span>
                  </p>
                  {hasCashedOut && (
                    <p className="mt-2 text-emerald-400 font-bold bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-800">
                      Won ${winAmount.toFixed(2)}!
                    </p>
                  )}
                </div>
              )}

              {gameState === "CRASHED" && (
                <div className="text-center animate-bounce">
                  <p className="text-xs font-bold text-rose-500 tracking-widest uppercase mb-1">
                    Crashed At
                  </p>
                  <p className="text-7xl font-black text-rose-500 tracking-tight">
                    {multiplier.toFixed(2)}x
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
