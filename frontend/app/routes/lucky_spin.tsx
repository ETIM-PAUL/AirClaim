import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '~/components/Sidebar';
import { useGeneral } from '~/context/GeneralContext';

const LuckySpinGame = () => {
  const { isSidebarCollapsed } = useGeneral();
  const [numbers, setNumbers] = useState(['1-20', '1-10', '1-20', '1-20', '1-20']);
  const [stakeAmount, setStakeAmount] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState(['--', '--', '--', '--', '--']);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [recentSpins] = useState([
    { time: 'Today, 14:32', numbers: [13, 7, 14, 8, 2], matches: 3, prize: '+20 FLR' },
    { time: 'Today, 14:25', numbers: [7, 19, 3, 11, 5], matches: 1, prize: '-5 FLR' },
    { time: 'Today, 14:18', numbers: [12, 1, 7, 16, 8], matches: 0, prize: '-5 FLR' }
  ]);

  // Roulette numbers in order (simplified version)
  const rouletteNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const generateRandomNumbers = () => {
    const newNumbers = Array(5).fill(0).map(() => Math.floor(Math.random() * 20) + 1);
    setNumbers(newNumbers.map(n => n.toString()));
  };

  const clearAll = () => {
    setNumbers(['1-20', '1-20', '1-20', '1-20', '1-20']);
    setCurrentResult(['--', '--', '--', '--', '--']);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = Math.floor(Math.random() * 5) + 3; // 3-7 full rotations
    const finalRotation = wheelRotation + (spins * 360) + Math.floor(Math.random() * 360);
    setWheelRotation(finalRotation);

    // Generate random results after spin
    setTimeout(() => {
      const results = Array(5).fill(0).map(() => Math.floor(Math.random() * 20) + 1);
      setCurrentResult(results.map(n => n.toString()));
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <Sidebar />
      <div className={`min-h-screen ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} text-white px-4 pt-12`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel - Game Controls */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h1 className="text-2xl font-bold mb-2">Lucky Spin Game</h1>
              <p className="text-gray-300 text-sm">
                Enter 5 different numbers between 1-20, spin the wheel, and win FLR tokens if your numbers match!
              </p>
            </div>

            {/* Number Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Your 5 Numbers:</label>
                <div className="flex gap-2">
                  <button 
                    onClick={generateRandomNumbers}
                    className="text-green-400 cursor-pointer text-sm hover:text-green-300 transition-colors"
                  >
                    Generate Random Numbers
                  </button>
                  <button 
                    onClick={clearAll}
                    className="text-red-400 cursor-pointer text-sm hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {numbers.map((num, index) => (
                  <div key={index} className="relative">
                    <input
                      type="text"
                      value={num}
                      onChange={(e) => {
                        const newNumbers = [...numbers];
                        newNumbers[index] = e.target.value;
                        setNumbers(newNumbers);
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-center text-sm focus:border-green-400 focus:outline-none"
                      placeholder="1-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stake Amount */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <label className="block text-sm font-medium mb-3">Stake Amount:</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-green-400 focus:outline-none"
                  min={5}
                  max={20}
                />
                <span className="text-green-400 font-medium">FLR</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Fixed stake amount: {stakeAmount} FLR per spin</p>
            </div>

            {/* Spin Button */}
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="w-full cursor-pointer bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
            </button>
            
            <p className="text-xs text-gray-400 text-center">
              By playing, you agree to the game rules and conditions.
            </p>

            {/* Recent Spins */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Your Recent Spins</h3>
              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-4 text-xs text-gray-400 pb-2 border-b border-gray-700">
                  <span>Time</span>
                  <span>Your Numbers</span>
                  <span>Result</span>
                  <span>Prize</span>
                </div>
                {recentSpins.map((spin, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 text-sm py-2">
                    <span className="text-gray-300">{spin.time}</span>
                    <span className="text-gray-300">{spin.numbers.join(', ')}</span>
                    <span className="text-gray-300">{spin.matches} matches</span>
                    <span className={spin.prize.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {spin.prize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Wheel and Results */}
          <div className="space-y-6">
            {/* Spin Wheel */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="relative w-80 h-80 mx-auto">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-pulse opacity-50"></div>
                
                {/* Wheel container */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
                  {/* Roulette wheel */}
                  <div 
                    className="absolute inset-4 rounded-full bg-gradient-to-br from-red-900 via-red-800 to-black border-4 border-yellow-500 transition-transform duration-3000 ease-out"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    {/* Numbers around the wheel */}
                    {rouletteNumbers.slice(0, 18).map((num, index) => (
                      <div
                        key={index}
                        className="absolute text-xs font-bold text-white"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${index * 20}deg) translateY(-60px) rotate(-${index * 20}deg)`,
                          color: num === 0 ? '#10b981' : (num % 2 === 0 ? '#ef4444' : '#1f2937')
                        }}
                      >
                        {num}
                      </div>
                    ))}
                    
                    {/* Center circle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-800 border-2 border-yellow-400 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">?</span>
                    </div>
                  </div>
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 z-10"></div>
              </div>
            </div>

            {/* Current Result */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="grid grid-cols-5 gap-3 mb-4">
                {currentResult.map((result, index) => (
                  <div key={index} className="bg-gray-700 border border-gray-600 rounded py-3 px-2 text-center font-mono text-lg">
                    {result}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Current Spin Result</h3>
                <p className="text-gray-400 text-sm">Spin the wheel to see the result</p>
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Game Rules</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <span>Enter 5 different numbers between 1-20</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <span>Stake at least 5 FLR to play one round</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <span>Click "Spin the Wheel" to start the game</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <span>Using FLR Secure Randomness, we will randomly get 5 numbers</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <span>Match 3 numbers: Win {(stakeAmount*5)} FLR</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <span>Match 4 numbers: Win {(stakeAmount*10)} FLR</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <span>Match all 5 numbers: Win {(stakeAmount*15)} FLR</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                  <span>Less than 3 matches: No prize</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckySpinGame;