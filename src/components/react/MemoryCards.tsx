import { useState, useEffect, useCallback } from 'react'
import {
  Brain,
  Heart,
  Star,
  Moon,
  Sun,
  Zap,
  Shield,
  Crown,
  Flame,
  Snowflake,
  Leaf,
  Droplet,
  Music,
  Camera,
  Coffee,
  Plane,
  Car,
  Bike,
  Ship,
  Train,
  Rocket,
  Mountain,
  Trees,
  Flower2,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Trophy,
  Gift,
  Gem,
  Key,
  Lock,
  Bell,
  Clock,
  Calendar,
  Map,
  Compass,
  Target,
  Flag,
  Bookmark,
  Book,
  Pen,
  Palette,
  Brush,
  Scissors,
  Wrench,
  Hammer,
  Gamepad2,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from 'lucide-react'

type IconType = typeof Heart
type Card = {
  id: string
  icon: IconType
  isFlipped: boolean
  isMatched: boolean
}

type GameState = 'idle' | 'playing' | 'won' | 'lost'

const ALL_ICONS: IconType[] = [
  Heart, Star, Moon, Sun, Zap, Shield, Crown, Flame, Snowflake, Leaf,
  Droplet, Music, Camera, Coffee, Plane, Car, Bike, Ship, Train, Rocket,
  Mountain, Trees, Flower2, Bug, Fish, Bird, Cat, Dog, Rabbit, Trophy,
  Gift, Gem, Key, Lock, Bell, Clock, Calendar, Map, Compass, Target,
  Flag, Bookmark, Book, Pen, Palette, Brush, Scissors, Wrench, Hammer,
  Gamepad2, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6,
]

export default function MemoryCards() {
  const [level, setLevel] = useState(1)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [gameState, setGameState] = useState<GameState>('idle')
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)

  // Calculate game parameters based on level
  const getGameParams = useCallback((currentLevel: number) => {
    // Difficulty scaling: starts easy, gets progressively harder
    const baseCards = 4 // 2 pairs minimum
    const additionalCards = Math.floor(currentLevel * 1.5) * 2 // Always even number for pairs
    const totalCards = Math.min(baseCards + additionalCards, 24) // Max 12 pairs
    
    // Time scales with difficulty but becomes more challenging
    const baseTime = 60
    const timePerCard = Math.max(3 - Math.floor(currentLevel / 3), 1.5)
    const totalTime = Math.floor(baseTime + (totalCards * timePerCard))
    
    return { totalCards, totalTime }
  }, [])

  // Initialize game for current level
  const initializeGame = useCallback(() => {
    const { totalCards, totalTime } = getGameParams(level)
    const pairs = totalCards / 2
    
    // Select random icons for this level
    const selectedIcons = ALL_ICONS.sort(() => Math.random() - 0.5).slice(0, pairs)
    
    // Create card pairs
    const gameCards: Card[] = []
    selectedIcons.forEach((icon, index) => {
      gameCards.push(
        {
          id: `${index}-a`,
          icon,
          isFlipped: false,
          isMatched: false,
        },
        {
          id: `${index}-b`,
          icon,
          isFlipped: false,
          isMatched: false,
        }
      )
    })
    
    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    
    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimeLeft(totalTime)
    setGameState('playing')
  }, [level, getGameParams])

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (gameState !== 'playing') return
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    
    const card = cards.find(c => c.id === cardId)
    if (card?.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    
    // Update card state
    setCards(prevCards => 
      prevCards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    )

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)
      
      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          )
          setMatchedPairs(prev => prev + 1)
          setFlippedCards([])
          setScore(prev => prev + (100 * level) + Math.floor(timeLeft / 10))
        }, 500)
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('lost')
    }
  }, [gameState, timeLeft])

  // Check win condition
  useEffect(() => {
    if (gameState === 'playing' && matchedPairs > 0 && matchedPairs === cards.length / 2) {
      setGameState('won')
    }
  }, [matchedPairs, cards.length, gameState])

  // Start next level
  const nextLevel = () => {
    setLevel(prev => prev + 1)
    initializeGame()
  }

  // Restart current level
  const restartLevel = () => {
    initializeGame()
  }

  // Reset game to level 1
  const resetGame = () => {
    setLevel(1)
    setScore(0)
    setGameState('idle')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getGridCols = () => {
    const cardCount = cards.length
    if (cardCount <= 8) return 'grid-cols-4'
    if (cardCount <= 12) return 'grid-cols-4'
    if (cardCount <= 16) return 'grid-cols-4'
    return 'grid-cols-6'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-sm shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold">Memory Cards</h2>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-3 rounded-sm text-center">
          <div className="text-sm text-blue-600 font-medium">Level</div>
          <div className="text-xl font-bold text-blue-800">{level}</div>
        </div>
        <div className="bg-green-100 p-3 rounded-sm text-center">
          <div className="text-sm text-green-600 font-medium">Score</div>
          <div className="text-xl font-bold text-green-800">{score}</div>
        </div>
        <div className="bg-orange-100 p-3 rounded-sm text-center">
          <div className="text-sm text-orange-600 font-medium">Moves</div>
          <div className="text-xl font-bold text-orange-800">{moves}</div>
        </div>
        <div className="bg-red-100 p-3 rounded-sm text-center">
          <div className="text-sm text-red-600 font-medium">Time</div>
          <div className="text-xl font-bold text-red-800">{formatTime(timeLeft)}</div>
        </div>
      </div>

      {/* Game State Messages */}
      {gameState === 'idle' && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-4">Memory Cards Game</h3>
          <p className="text-gray-600 mb-4">
            Match pairs of cards to advance through endless levels. Each level gets progressively harder!
          </p>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-sm hover:bg-blue-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="text-center mb-6 p-4 bg-green-100 rounded-sm">
          <h3 className="text-2xl font-bold text-green-800 mb-2">Level Complete! 🎉</h3>
          <p className="text-green-700 mb-4">
            Great job! You completed level {level} in {moves} moves.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={nextLevel}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-sm hover:bg-green-600 transition-colors"
            >
              Next Level
            </button>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-sm hover:bg-gray-600 transition-colors"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="text-center mb-6 p-4 bg-red-100 rounded-sm">
          <h3 className="text-2xl font-bold text-red-800 mb-2">Time's Up! ⏰</h3>
          <p className="text-red-700 mb-4">
            Don't give up! Try level {level} again or restart from the beginning.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={restartLevel}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-sm hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-sm hover:bg-gray-600 transition-colors"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}

      {/* Game Board */}
      {gameState === 'playing' && (
        <div className={`grid ${getGridCols()} gap-3 justify-items-center`}>
          {cards.map((card) => {
            const IconComponent = card.icon
            const isVisible = card.isFlipped || card.isMatched
            
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-sm border-2 transition-all duration-300 
                  flex items-center justify-center relative overflow-hidden
                  ${card.isMatched 
                    ? 'bg-green-100 border-green-400 cursor-default' 
                    : isVisible
                      ? 'bg-blue-100 border-blue-400 cursor-default'
                      : 'bg-gray-200 border-gray-400 hover:bg-gray-300 cursor-pointer'
                  }
                  ${flippedCards.includes(card.id) ? 'animate-pulse' : ''}
                `}
                disabled={card.isMatched || flippedCards.length >= 2}
              >
                <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <IconComponent 
                    className={`w-8 h-8 md:w-10 md:h-10 ${
                      card.isMatched ? 'text-green-600' : 'text-blue-600'
                    }`} 
                  />
                </div>
                {!isVisible && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-500 rounded-full opacity-30"></div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Progress Indicator */}
      {gameState === 'playing' && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{matchedPairs}/{cards.length / 2} pairs</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(matchedPairs / (cards.length / 2)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}