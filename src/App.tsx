import { useState, useEffect, useCallback } from 'react'
import './App.css'

interface TokenData {
  id: string
  name: string
  symbol: string
  inflow24h: number
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  logo: string
}

// Mock data generator for demo - in production this would fetch from MobyDash API
const generateMockTokens = (): TokenData[] => {
  const tokens = [
    { name: 'dogwifhat', symbol: 'WIF', logo: '🐕' },
    { name: 'Bonk', symbol: 'BONK', logo: '🦴' },
    { name: 'BOOK OF MEME', symbol: 'BOME', logo: '📖' },
    { name: 'Popcat', symbol: 'POPCAT', logo: '🐱' },
    { name: 'Cat in a dogs world', symbol: 'MEW', logo: '😺' },
    { name: 'Dogecoin', symbol: 'DOGE', logo: '🐶' },
    { name: 'Pepe', symbol: 'PEPE', logo: '🐸' },
    { name: 'Shiba Inu', symbol: 'SHIB', logo: '🦊' },
    { name: 'Floki', symbol: 'FLOKI', logo: '⚡' },
    { name: 'Brett', symbol: 'BRETT', logo: '👦' },
    { name: 'SLERF', symbol: 'SLERF', logo: '🦥' },
    { name: 'Wen', symbol: 'WEN', logo: '📅' },
    { name: 'Myro', symbol: 'MYRO', logo: '🐕‍🦺' },
    { name: 'Samoyedcoin', symbol: 'SAMO', logo: '🐩' },
    { name: 'Gigachad', symbol: 'GIGA', logo: '💪' },
  ]

  return tokens
    .map((token, i) => ({
      id: `token-${i}`,
      name: token.name,
      symbol: token.symbol,
      logo: token.logo,
      inflow24h: Math.random() * 50000000 + 1000000,
      price: Math.random() * 10,
      change24h: (Math.random() - 0.4) * 100,
      volume24h: Math.random() * 100000000 + 5000000,
      marketCap: Math.random() * 5000000000 + 100000000,
    }))
    .sort((a, b) => b.inflow24h - a.inflow24h)
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

const formatPrice = (price: number): string => {
  if (price < 0.0001) return `$${price.toExponential(2)}`
  if (price < 1) return `$${price.toFixed(6)}`
  return `$${price.toFixed(4)}`
}

function App() {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [countdown, setCountdown] = useState(300)
  const [isLoading, setIsLoading] = useState(true)
  const [glitchActive, setGlitchActive] = useState(false)

  const fetchData = useCallback(() => {
    setIsLoading(true)
    setGlitchActive(true)

    // Simulate API fetch delay
    setTimeout(() => {
      setTokens(generateMockTokens())
      setLastUpdate(new Date())
      setCountdown(300)
      setIsLoading(false)
      setTimeout(() => setGlitchActive(false), 300)
    }, 800)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 300))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div className="grid-overlay" />
        <div className="scanline" />
      </div>

      {/* Main content */}
      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8 md:mb-12">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight ${glitchActive ? 'glitch' : ''}`}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                    MEME FLOW
                  </span>
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 font-mono">
                  SOLANA TOP INFLOWS // MOBYDASH TRACKER
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`inline-block w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                  <span className="text-xs sm:text-sm text-gray-400 font-mono">
                    {isLoading ? 'SYNCING...' : 'LIVE'}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-mono">
                  Next update: <span className="text-cyan-400">{formatCountdown(countdown)}</span>
                </div>
                <div className="text-xs text-gray-700 font-mono">
                  Last: {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs">
              <div className="stat-chip">
                <span className="text-gray-500">TRACKING</span>
                <span className="text-white font-bold">{tokens.length} TOKENS</span>
              </div>
              <div className="stat-chip">
                <span className="text-gray-500">TOTAL INFLOWS</span>
                <span className="text-green-400 font-bold">
                  {formatNumber(tokens.reduce((sum, t) => sum + t.inflow24h, 0))}
                </span>
              </div>
              <div className="stat-chip">
                <span className="text-gray-500">AVG CHANGE</span>
                <span className={`font-bold ${tokens.reduce((sum, t) => sum + t.change24h, 0) / tokens.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(tokens.reduce((sum, t) => sum + t.change24h, 0) / tokens.length).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Token Table */}
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-[600px] sm:min-w-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 font-mono border-b border-gray-800/50 uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Token</div>
              <div className="col-span-2 text-right">Inflow 24h</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">24h %</div>
              <div className="col-span-2 text-right hidden sm:block">MCap</div>
            </div>

            {/* Token Rows */}
            <div className="space-y-1 sm:space-y-2">
              {tokens.map((token, index) => (
                <div
                  key={token.id}
                  className={`token-row grid grid-cols-12 gap-2 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 items-center rounded-lg transition-all duration-300 ${
                    index === 0 ? 'first-place' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    <span className={`rank-badge ${index < 3 ? 'top-three' : ''}`}>
                      {index + 1}
                    </span>
                  </div>

                  {/* Token Info */}
                  <div className="col-span-3 flex items-center gap-2 sm:gap-3">
                    <div className="token-logo text-xl sm:text-2xl">
                      {token.logo}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm sm:text-base text-white truncate">{token.symbol}</div>
                      <div className="text-xs text-gray-500 truncate hidden sm:block">{token.name}</div>
                    </div>
                  </div>

                  {/* Inflow */}
                  <div className="col-span-2 text-right">
                    <div className="text-green-400 font-mono font-bold text-sm sm:text-base">
                      +{formatNumber(token.inflow24h)}
                    </div>
                    <div className="inflow-bar">
                      <div
                        className="inflow-fill"
                        style={{ width: `${(token.inflow24h / tokens[0].inflow24h) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right font-mono text-sm sm:text-base text-gray-300">
                    {formatPrice(token.price)}
                  </div>

                  {/* 24h Change */}
                  <div className="col-span-2 text-right">
                    <span className={`change-badge ${token.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                    </span>
                  </div>

                  {/* Market Cap */}
                  <div className="col-span-2 text-right font-mono text-sm text-gray-400 hidden sm:block">
                    {formatNumber(token.marketCap)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refresh button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="refresh-button"
          >
            <span className={isLoading ? 'animate-spin' : ''}>⟳</span>
            <span>{isLoading ? 'REFRESHING...' : 'REFRESH NOW'}</span>
          </button>
        </div>

        {/* Data source note */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">
            Data source: <span className="text-purple-400">MobyDash API</span> • Updates every 5 minutes
          </p>
          <p className="text-xs text-gray-700 font-mono mt-1">
            Demo mode: Showing simulated data
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800/30">
          <p className="text-center text-xs text-gray-600 font-mono">
            Requested by <span className="text-gray-500">@modzzdude</span> · Built by <span className="text-gray-500">@clonkbot</span>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
