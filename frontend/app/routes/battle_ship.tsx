import React, { useState, useEffect } from 'react';
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { GiMissileLauncher, GiSubmarineMissile } from 'react-icons/gi';
import { CgClose } from 'react-icons/cg';
import { TbDroneOff } from 'react-icons/tb';
import { toast } from 'react-toastify';
import Sidebar from '~/components/Sidebar';
import { useGeneral } from '~/context/GeneralContext';
import { ethers, Contract, BrowserProvider, BigNumberish, formatEther, parseEther } from 'ethers';
import { abi as BATTLE_SHIP_ABI } from "../../../artifacts/contracts/BattleShip/BattleShip.sol/BattleShip.json"
import { BattleShipInstance } from "../../../typechain-types"
import { formatLocalized } from '~/utils';
import { fromUnixTime } from 'date-fns';

const BATTLE_SHIP_ADDRESS = "0x50BD8dA3C2d17762bc18B4Bf3f77fd79CFa60c1C"

interface RecentBattle {
    prediction: string
    target: string
    result: string
    time: string
    prize: string
}

const ZombieBattleship = () => {
  const { isSidebarCollapsed } = useGeneral();
  const [selectedBox, setSelectedBox] = useState<number>(NaN);
  const [stakeAmount, setStakeAmount] = useState(1);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [targetBox, setTargetBox] = useState<number>(NaN);
  const [explodingBox, setExplodingBox] = useState<number>(NaN);
  const [gameResult, setGameResult] = useState<any>(null);
  const [zombieGrid, setZombieGrid] = useState(Array(16).fill(true)); // true means zombie alive
  const [recentBattles, setRecentBattles] = useState<RecentBattle[]>([]);

  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider("eip155")
  
  useEffect(() => {
    fetchUserRecentBattles()
  }, [address, refetch])

  async function fetchUserRecentBattles() {
    function transformBattleData(data: BigNumberish[]) {
        const timestamp = fromUnixTime(Number(data[4]))
        return {
            prediction: data[0].toString(),
            target: data[1].toString(),
            result: data[2].toString() === '0' ? 'HIT' : 'MISS',
            time: formatLocalized(timestamp),
            prize: data[2].toString() === '0' ? `+${formatEther(data[3])} FLR` : `-${formatEther(data[3])} FLR`
        }
    }
    function deepUnwrap(value: any): any {
        if (Array.isArray(value)) {
          return value.map((v: any) => deepUnwrap(v));
        }
        // BigInt, number, string, etc.
        if (typeof value !== 'object' || value === null) {
          return value;
        }
        // Try shallow clone of object
        const clone: any = {};
        for (const key of Reflect.ownKeys(value)) {
          clone[key] = deepUnwrap(value[key]);
        }
        return clone;
    }
    
    try {
        const provider = new ethers.BrowserProvider(walletProvider as any);
        const BattleShip: BattleShipInstance = new Contract(BATTLE_SHIP_ADDRESS, BATTLE_SHIP_ABI, provider)
        setIsFetching(true)
        const result = await BattleShip.getUserDroneBattles(address)
        console.log("battles", result)
        const wrappedResult = deepUnwrap(result)
        const recentBattles = wrappedResult.map(transformBattleData)
        // console.log("user recent battles", recentBattles)
        setRecentBattles(recentBattles)
        setIsFetching(false)
    } catch (error) {
        console.error('Error fetching user recent battles', error)
        setIsFetching(false)
    }
  }

  const generateRandomPrediction = () => {
    const randomBox:any = Math.floor(Math.random() * 16);
    setSelectedBox(randomBox);
  };

  const clearSelection = () => {
    setSelectedBox(NaN);
    setGameResult(null);
  };

  const dropDrone = async () => {
    try {
        if (stakeAmount > 2 || stakeAmount < 1) {
         toast.error("Stake amount must be between 1-2")
         return;
        } 
        if (isAttacking || Number.isNaN(selectedBox)) return;
        
        setIsAttacking(true);
        setGameResult(null);
        const ethersProvider = new BrowserProvider(walletProvider as any)
        const signer = await ethersProvider.getSigner()
        const BattleShip: BattleShipInstance = new Contract(BATTLE_SHIP_ADDRESS, BATTLE_SHIP_ABI, signer)
        const prediction = selectedBox
        const stakeAmountEth = parseEther(stakeAmount.toString())
        const tx = await BattleShip.dropDrone(prediction, {value: stakeAmountEth})
        const receipt = await tx.wait();
    
        // Filter logs for your event
        const eventTopic = BattleShip.interface.getEvent("DroneDropped").topicHash;
        const log = receipt.logs.find((l: any) => l.topics[0] === eventTopic);
        // console.log('event topic', eventTopic, 'log', log)
        if (log) {
            const parsed = BattleShip.interface.parseLog(log);
            // const player = parsed.args['0']
            // const prediction = Number(parsed.args['1'])
            const target = Number(parsed.args['2'])
            const result = parsed.args['3'] === '0' ? true : false // HIT - 0, MISS - 1
            const prize = parsed.args['4']
            // const time = parsed.args['5']
            setTargetBox(target)
            setExplodingBox(target);

            // Remove zombie from grid
            const newGrid = [...zombieGrid];
            newGrid[target] = false;
            setZombieGrid(newGrid);
            
            // Check if prediction was correct
            const isHit = result;
            setGameResult({
                prediction: selectedBox,
                target: target,
                isHit: isHit,
                prize: isHit ? `+${formatEther(prize)} FLR` : `-${formatEther(prize)} FLR`
            });

            setTimeout(() => {
                setIsAttacking(false);
                setRefetch(true);
                setSelectedBox(NaN)
                setZombieGrid(Array(16).fill(true));
                setExplodingBox(NaN);
                setTargetBox(NaN);
            }, 1500);
        } else toast.error("Unable to fetch battle result")
        
    } catch (error) {
        console.error(error)
        toast.error("Failed to drop drone");
        setIsAttacking(false);
        setZombieGrid(Array(16).fill(true));
        setExplodingBox(NaN);
        setTargetBox(NaN);
    }
  };

  const resetGrid = () => {
    setZombieGrid(Array(16).fill(true));
    setExplodingBox(NaN);
    setTargetBox(NaN);
    setGameResult(null);
  };
  

  const ZombieIcon = ({ isAlive, isExploding }:any) => {
    if (!isAlive && !isExploding) {
      return (
        <div className="text-red-500 text-2xl">💀</div>
      );
    }
    
    if (isExploding) {
      return (
        <div className="animate-pulse text-orange-500 text-3xl">💥</div>
      );
    }
    
    return (
      <div className="text-green-400 text-2xl animate-bounce">🧟</div>
    );
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
                <h1 className="text-2xl font-bold mb-2">Zombie Battleship</h1>
                <p className="text-gray-300 text-sm">
                Predict which box the general will drop a drone to eliminate a zombie. Pick the right box and win FLR tokens!
                </p>
            </div>

            {/* Box Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Your Prediction:</label>
                <div className="flex gap-2">
                    <button 
                    onClick={generateRandomPrediction}
                    className="text-green-400 cursor-pointer text-sm hover:text-green-300 transition-colors"
                    >
                    Random Prediction
                    </button>
                    <button 
                    onClick={clearSelection}
                    className="text-red-400 cursor-pointer text-sm hover:text-red-300 transition-colors"
                    >
                    Clear Selection
                    </button>
                </div>
                </div>
                
                <div className="text-center">
                {selectedBox !== null && !Number.isNaN(selectedBox) ? (
                    <div className="bg-green-600 inline-block px-6 py-3 rounded-lg">
                    <span className="text-lg font-bold">Box {selectedBox}</span>
                    </div>
                ) : (
                    <div className="bg-gray-700 inline-block px-6 py-3 rounded-lg">
                    <span className="text-gray-400">No box selected</span>
                    </div>
                )}
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
                    min="1"
                />
                <span className="text-green-400 font-medium">FLR</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Stake amount: maximum of 2 FLR per attack</p>
            </div>

            {/* Attack Button */}
            <button
                onClick={dropDrone}
                disabled={isAttacking || selectedBox === null}
                className="w-full cursor-pointer bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <span className={`text-lg ${isAttacking ? 'animate-spin' : ''}`}><GiMissileLauncher/></span>
                {isAttacking ? 'Dropping Drone...' : 'Drop Drone'}
            </button>
            
            <p className="text-xs text-gray-400 text-center">
                By playing, you agree to the game rules and conditions.
            </p>

            {/* Game Result */}
            {gameResult && (
                <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${gameResult.isHit ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold mb-2">Battle Result</h3>
                <button
                    onClick={() => setGameResult(null)}
                    className="border border-white rounded-md cursor-pointer px-2 mb-2"
                >
                    <span><CgClose/></span>
                </button>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    <span>Your Prediction:</span>
                    <span className="font-bold">Box {gameResult.prediction}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Drone Target:</span>
                    <span className="font-bold">Box {gameResult.target}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Result:</span>
                    <span className={`font-bold ${gameResult.isHit ? 'text-green-400' : 'text-red-400'}`}>
                        {gameResult.isHit ? 'HIT! 🎯' : 'MISS! ❌'}
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span>Prize:</span>
                    <span className={`font-bold ${gameResult.prize.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {gameResult.prize}
                    </span>
                    </div>
                </div>
                </div>
            )}

            {/* Recent Battles */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Recent Battles</h3>
                {!isFetching && recentBattles.length === 0 && (
                    <div className="space-y-1 flex flex-col items-center">
                        <p className="text-sm text-gray-400">No battles yet</p>
                    </div>
                )}
                {!isFetching && recentBattles.length > 0 && (
                    <div className="space-y-1">
                        <div className="grid grid-cols-5 gap-2 text-xs text-gray-400 pb-2 border-b border-gray-700">
                            <span>Time</span>
                            <span>Prediction</span>
                            <span>Target</span>
                            <span>Result</span>
                            <span>Prize</span>
                        </div>
                        {recentBattles.map((battle, index) => (
                            <div key={index} className="grid grid-cols-5 gap-2 text-sm py-2">
                            <span className="text-gray-300">{battle.time}</span>
                            <span className="text-gray-300">Box {battle.prediction}</span>
                            <span className="text-gray-300">Box {battle.target}</span>
                            <span className={battle.result === 'HIT' ? 'text-green-400' : 'text-red-400'}>
                                {battle.result}
                            </span>
                            <span className={battle.prize.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                                {battle.prize}
                            </span>
                            </div>
                        ))}
                    </div>
                )}
                {isFetching && recentBattles.length === 0 && (
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                        <div className="h-4 w-16 bg-white animate-pulse rounded-md" />
                        <div className="h-4 w-8 bg-white animate-pulse rounded-md" />
                        </div>
                        <div className="h-2 w-full bg-white animate-pulse rounded-md" />
                        <div className="h-2 w-1/4 bg-white animate-pulse rounded-md" />
                        <div className="space-y-2">
                        <div className="h-2 w-full bg-white animate-pulse rounded-md" />
                        <div className="h-2 w-full bg-white animate-pulse rounded-md" />
                        <div className="h-2 w-full bg-white animate-pulse rounded-md" />
                        </div>
                        <div className="flex items-center justify-between">
                        <div className="h-2 w-8 bg-white animate-pulse rounded-md" />
                        <div className="h-6 w-10 bg-white animate-pulse rounded-md" />
                        </div>
                    </div>
                )}
            </div>
            </div>

            {/* Right Panel - Battlefield Grid */}
            <div className="space-y-6">
            {/* Battlefield */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Zombie Battlefield</h3>
                <button
                    onClick={resetGrid}
                    className="text-green-400 cursor-pointer text-sm hover:text-blue-300 transition-colors"
                >
                    Reset Battlefield
                </button>
                </div>
                
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {Array(16).fill(0).map((_, index:any) => (
                    <div
                    key={index}
                    onClick={() => !isAttacking && setSelectedBox(index)}
                    className={`
                        relative aspect-square bg-gray-700 border-2 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center hover:bg-gray-600
                        ${selectedBox === index ? 'border-green-400 bg-green-900' : 'border-gray-600'}
                        ${targetBox === index && isAttacking ? 'ring-4 ring-red-400 animate-pulse' : ''}
                        ${explodingBox === index ? 'bg-orange-600 animate-bounce' : ''}
                    `}
                    >
                    {/* Box Number */}
                    <div className="absolute top-1 left-1 text-xs text-gray-400 font-mono">
                        {index}
                    </div>
                    
                    {/* Zombie/Explosion */}
                    <ZombieIcon 
                        isAlive={zombieGrid[index]} 
                        isExploding={explodingBox === index}
                    />
                    
                    {/* Drone Target Indicator */}
                    {targetBox === index && isAttacking && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
                        <GiSubmarineMissile/>
                        </div>
                    )}
                    
                    {/* Selection Indicator */}
                    {selectedBox === index && (
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                        </div>
                    )}
                    </div>
                ))}
                </div>
                
                <div className="text-center mt-4">
                <p className="text-gray-400 text-sm">
                    Click on a box to make your prediction
                </p>
                <p className="text-gray-300 text-xs mt-1">
                    🧟 = Zombie Alive | 💀 = Zombie Eliminated | 💥 = Explosion
                </p>
                </div>
            </div>

            {/* Game Rules */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Battle Rules</h3>
                <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                    <span>Select a box (0-15) where you think the drone will strike</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                    <span>Stake FLR tokens to participate in the battle</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                    <span>Click "Drop Drone" to launch the attack</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                    <span>The general randomly selects a target box</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                    <span>Correct prediction: Win 2x your stake ({stakeAmount * 2}FLR)</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                    <span>Wrong prediction: Lose your stake</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span>Eliminated zombies turn into skulls (💀)</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span>Reset battlefield to restore all zombies</span>
                </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Battlefield Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-400">
                    {zombieGrid.filter(zombie => zombie).length}
                    </div>
                    <div className="text-xs text-gray-400">Zombies Alive</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-400">
                    {zombieGrid.filter(zombie => !zombie).length}
                    </div>
                    <div className="text-xs text-gray-400">Zombies Eliminated</div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default ZombieBattleship;