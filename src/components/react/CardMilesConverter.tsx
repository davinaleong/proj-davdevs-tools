import { useState, useEffect } from "react"
import {
  CreditCard,
  Plane,
  Calculator,
  TrendingUp,
  ArrowRightLeft,
  Copy,
  Check,
  Info,
  Star,
  DollarSign,
  Globe,
  Search,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react"

interface LoyaltyProgram {
  id: string
  name: string
  type: "airline" | "hotel" | "credit_card"
  icon: string
  cashValue: number // cents per point/mile in USD
  transferRatio: number // how many points = 1 mile (for transfers)
  currency: "points" | "miles"
  region:
    | "global"
    | "asean"
    | "singapore"
    | "malaysia"
    | "thailand"
    | "indonesia"
    | "philippines"
    | "asia_pacific"
    | "australia"
    | "hong_kong"
    | "taiwan"
    | "middle_east"
  baseCurrency:
    | "USD"
    | "SGD"
    | "MYR"
    | "THB"
    | "IDR"
    | "PHP"
    | "AUD"
    | "HKD"
    | "TWD"
    | "AED"
}

interface ConversionResult {
  program: LoyaltyProgram
  amount: number
  cashValueUSD: number
  cashValueLocal: number
  localCurrency: string
  transferValue?: number
}

interface ExchangeRates {
  [key: string]: number // rates to USD
}

export default function CardMilesConverter() {
  const [sourceAmount, setSourceAmount] = useState<string>("")
  const [sourceProgramId, setSourceProgramId] = useState<string>("dbs-points")
  const [targetProgramId, setTargetProgramId] =
    useState<string>("singapore-airlines")
  const [selectedCurrency, setSelectedCurrency] = useState<string>("SGD")
  const [conversionResults, setConversionResults] = useState<
    ConversionResult[]
  >([])
  const [copied, setCopied] = useState<string | null>(null)

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "airline",
    "hotel",
    "credit_card",
  ])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [minValue, setMinValue] = useState<string>("")
  const [maxValue, setMaxValue] = useState<string>("")
  const [sortBy, setSortBy] = useState<"value" | "name" | "type">("value")

  // Current exchange rates (in practice, these would be fetched from an API)
  const exchangeRates: ExchangeRates = {
    USD: 1.0,
    SGD: 0.74, // 1 SGD = 0.74 USD
    MYR: 0.23, // 1 MYR = 0.23 USD
    THB: 0.028, // 1 THB = 0.028 USD
    IDR: 0.000066, // 1 IDR = 0.000066 USD
    PHP: 0.018, // 1 PHP = 0.018 USD
    AUD: 0.67, // 1 AUD = 0.67 USD
    HKD: 0.13, // 1 HKD = 0.13 USD
    TWD: 0.031, // 1 TWD = 0.031 USD
    AED: 0.27, // 1 AED = 0.27 USD
  }

  const currencies = [
    { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
    { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
    { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
    { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
    { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
    { code: "TWD", name: "Taiwan Dollar", flag: "🇹🇼" },
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  ]

  const loyaltyPrograms: LoyaltyProgram[] = [
    // ASEAN Credit Card Programs
    {
      id: "dbs-points",
      name: "DBS Points (Singapore)",
      type: "credit_card",
      icon: "🏦",
      cashValue: 0.67, // ~1 SGD cent = 0.67 USD cents
      transferRatio: 1,
      currency: "points",
      region: "singapore",
      baseCurrency: "SGD",
    },
    {
      id: "ocbc-voyage",
      name: "OCBC Voyage Miles",
      type: "credit_card",
      icon: "⛵",
      cashValue: 0.74,
      transferRatio: 1,
      currency: "miles",
      region: "singapore",
      baseCurrency: "SGD",
    },
    {
      id: "uob-unirewards",
      name: "UOB UNI$ Points",
      type: "credit_card",
      icon: "🦄",
      cashValue: 0.67,
      transferRatio: 1,
      currency: "points",
      region: "singapore",
      baseCurrency: "SGD",
    },
    {
      id: "maybank-treats",
      name: "Maybank TreatsPoints",
      type: "credit_card",
      icon: "🎁",
      cashValue: 0.23, // ~1 MYR cent = 0.23 USD cents
      transferRatio: 1,
      currency: "points",
      region: "malaysia",
      baseCurrency: "MYR",
    },
    {
      id: "cimb-rewards",
      name: "CIMB Rewards Points",
      type: "credit_card",
      icon: "🔴",
      cashValue: 0.2,
      transferRatio: 1,
      currency: "points",
      region: "malaysia",
      baseCurrency: "MYR",
    },
    {
      id: "bca-points",
      name: "BCA Rewards Points",
      type: "credit_card",
      icon: "💙",
      cashValue: 0.000066, // IDR value
      transferRatio: 100, // 100 BCA points = 1 mile
      currency: "points",
      region: "indonesia",
      baseCurrency: "IDR",
    },

    // Global Programs (available in ASEAN)
    {
      id: "citi-ty",
      name: "Citi ThankYou Points",
      type: "credit_card",
      icon: "🏛️",
      cashValue: 1.6,
      transferRatio: 1,
      currency: "points",
      region: "global",
      baseCurrency: "USD",
    },
    {
      id: "amex-mr",
      name: "American Express Membership Rewards",
      type: "credit_card",
      icon: "💎",
      cashValue: 2.0,
      transferRatio: 1,
      currency: "points",
      region: "global",
      baseCurrency: "USD",
    },

    // ASEAN Airlines
    {
      id: "singapore-airlines",
      name: "Singapore Airlines KrisFlyer",
      type: "airline",
      icon: "🛫",
      cashValue: 1.5,
      transferRatio: 1,
      currency: "miles",
      region: "singapore",
      baseCurrency: "SGD",
    },
    {
      id: "malaysia-airlines",
      name: "Malaysia Airlines Enrich",
      type: "airline",
      icon: "🦅",
      cashValue: 1.2,
      transferRatio: 1,
      currency: "miles",
      region: "malaysia",
      baseCurrency: "MYR",
    },
    {
      id: "thai-airways",
      name: "Thai Airways Royal Orchid Plus",
      type: "airline",
      icon: "🌺",
      cashValue: 1.0,
      transferRatio: 1,
      currency: "miles",
      region: "thailand",
      baseCurrency: "THB",
    },
    {
      id: "garuda-indonesia",
      name: "Garuda Indonesia GarudaMiles",
      type: "airline",
      icon: "🦅",
      cashValue: 0.8,
      transferRatio: 1,
      currency: "miles",
      region: "indonesia",
      baseCurrency: "IDR",
    },
    {
      id: "philippine-airlines",
      name: "Philippine Airlines Mabuhay Miles",
      type: "airline",
      icon: "🇵🇭",
      cashValue: 1.1,
      transferRatio: 1,
      currency: "miles",
      region: "philippines",
      baseCurrency: "PHP",
    },
    {
      id: "jetstar-asia",
      name: "Jetstar Asia Club Jetstar",
      type: "airline",
      icon: "⭐",
      cashValue: 0.9,
      transferRatio: 1,
      currency: "points",
      region: "asean",
      baseCurrency: "SGD",
    },
    {
      id: "airasia-bigpoints",
      name: "AirAsia BIG Points",
      type: "airline",
      icon: "🔴",
      cashValue: 0.8,
      transferRatio: 1,
      currency: "points",
      region: "asean",
      baseCurrency: "MYR",
    },

    // International Airlines (popular in ASEAN)
    {
      id: "united-miles",
      name: "United MileagePlus",
      type: "airline",
      icon: "🛫",
      cashValue: 1.3,
      transferRatio: 1,
      currency: "miles",
      region: "global",
      baseCurrency: "USD",
    },

    // Asia Pacific Airlines
    {
      id: "cathay-pacific",
      name: "Cathay Pacific Asia Miles",
      type: "airline",
      icon: "🐉",
      cashValue: 1.4,
      transferRatio: 1,
      currency: "miles",
      region: "hong_kong",
      baseCurrency: "HKD",
    },
    {
      id: "eva-air",
      name: "EVA Air Infinity MileageLands",
      type: "airline",
      icon: "🌟",
      cashValue: 1.2,
      transferRatio: 1,
      currency: "miles",
      region: "taiwan",
      baseCurrency: "TWD",
    },
    {
      id: "qantas-ff",
      name: "Qantas Frequent Flyer",
      type: "airline",
      icon: "🦘",
      cashValue: 1.5,
      transferRatio: 1,
      currency: "points",
      region: "australia",
      baseCurrency: "AUD",
    },

    // Middle East Airlines
    {
      id: "etihad-guest",
      name: "Etihad Guest",
      type: "airline",
      icon: "🏜️",
      cashValue: 1.3,
      transferRatio: 1,
      currency: "miles",
      region: "middle_east",
      baseCurrency: "AED",
    },
    {
      id: "qatar-privilege",
      name: "Qatar Airways Privilege Club",
      type: "airline",
      icon: "🏛️",
      cashValue: 1.4,
      transferRatio: 1,
      currency: "miles",
      region: "middle_east",
      baseCurrency: "USD",
    },

    // European Airlines (popular in Asia Pacific)
    {
      id: "flying-blue",
      name: "Flying Blue (Air France-KLM)",
      type: "airline",
      icon: "🔵",
      cashValue: 1.2,
      transferRatio: 1,
      currency: "miles",
      region: "global",
      baseCurrency: "USD",
    },
    {
      id: "british-airways",
      name: "British Airways Executive Club",
      type: "airline",
      icon: "🇬🇧",
      cashValue: 1.1,
      transferRatio: 1,
      currency: "points",
      region: "global",
      baseCurrency: "USD",
    },
    {
      id: "turkish-miles",
      name: "Turkish Airlines Miles&Smiles",
      type: "airline",
      icon: "🦃",
      cashValue: 1.0,
      transferRatio: 1,
      currency: "miles",
      region: "global",
      baseCurrency: "USD",
    },

    // ASEAN Hotels
    {
      id: "shangri-la",
      name: "Shangri-La Circle",
      type: "hotel",
      icon: "🏯",
      cashValue: 1.2,
      transferRatio: 2,
      currency: "points",
      region: "asean",
      baseCurrency: "USD",
    },
    {
      id: "far-east-hospitality",
      name: "Far East Hospitality",
      type: "hotel",
      icon: "🏨",
      cashValue: 0.67,
      transferRatio: 3,
      currency: "points",
      region: "singapore",
      baseCurrency: "SGD",
    },

    // Global Hotels
    {
      id: "marriott-points",
      name: "Marriott Bonvoy",
      type: "hotel",
      icon: "🏨",
      cashValue: 0.8,
      transferRatio: 3,
      currency: "points",
      region: "global",
      baseCurrency: "USD",
    },
    {
      id: "hilton-points",
      name: "Hilton Honors",
      type: "hotel",
      icon: "🏩",
      cashValue: 0.5,
      transferRatio: 10,
      currency: "points",
      region: "global",
      baseCurrency: "USD",
    },
    {
      id: "ihg-rewards",
      name: "IHG Rewards Club",
      type: "hotel",
      icon: "🏰",
      cashValue: 0.5,
      transferRatio: 10,
      currency: "points",
      region: "global",
      baseCurrency: "USD",
    },
  ]

  const getProgram = (id: string) => loyaltyPrograms.find((p) => p.id === id)

  const convertToUSD = (amount: number, fromCurrency: string): number => {
    return amount * exchangeRates[fromCurrency]
  }

  const convertFromUSD = (amount: number, toCurrency: string): number => {
    return amount / exchangeRates[toCurrency]
  }

  const calculateConversions = () => {
    const amount = parseFloat(sourceAmount)
    if (!amount || amount <= 0) {
      setConversionResults([])
      return
    }

    const sourceProgram = getProgram(sourceProgramId)
    if (!sourceProgram) return

    const results: ConversionResult[] = loyaltyPrograms.map((targetProgram) => {
      let convertedAmount = amount
      let transferValue: number | undefined

      // Calculate transfer value if converting between different programs
      if (sourceProgram.id !== targetProgram.id) {
        // Transfer calculation based on program types and ratios
        if (
          sourceProgram.type === "hotel" &&
          targetProgram.type === "airline"
        ) {
          convertedAmount = amount / sourceProgram.transferRatio
        } else if (
          sourceProgram.type === "airline" &&
          targetProgram.type === "hotel"
        ) {
          convertedAmount = amount * targetProgram.transferRatio
        } else if (
          sourceProgram.type === "credit_card" &&
          targetProgram.type !== "credit_card"
        ) {
          convertedAmount = amount / sourceProgram.transferRatio
        }
        transferValue = convertedAmount
      }

      // Calculate cash value in USD
      let cashValueUSD: number
      if (targetProgram.baseCurrency === "USD") {
        cashValueUSD = (convertedAmount * targetProgram.cashValue) / 100
      } else {
        // Convert program's cash value to USD first
        const localCashValue = (convertedAmount * targetProgram.cashValue) / 100
        cashValueUSD = convertToUSD(localCashValue, targetProgram.baseCurrency)
      }

      // Convert to selected display currency
      const cashValueLocal = convertFromUSD(cashValueUSD, selectedCurrency)

      return {
        program: targetProgram,
        amount: convertedAmount,
        cashValueUSD,
        cashValueLocal,
        localCurrency: selectedCurrency,
        transferValue,
      }
    })

    // Sort by USD cash value (highest first)
    results.sort((a, b) => b.cashValueUSD - a.cashValueUSD)
    setConversionResults(results)
  }

  const getFilteredAndSortedResults = () => {
    let filtered = conversionResults.filter((result) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        result.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.program.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.program.region.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(result.program.type)

      // Region filter
      const matchesRegion =
        selectedRegions.length === 0 ||
        selectedRegions.includes(result.program.region)

      // Value filter
      const matchesMinValue =
        minValue === "" || result.cashValueLocal >= parseFloat(minValue)
      const matchesMaxValue =
        maxValue === "" || result.cashValueLocal <= parseFloat(maxValue)

      return (
        matchesSearch &&
        matchesType &&
        matchesRegion &&
        matchesMinValue &&
        matchesMaxValue
      )
    })

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.program.name.localeCompare(b.program.name)
        case "type":
          return a.program.type.localeCompare(b.program.type)
        case "value":
        default:
          return b.cashValueUSD - a.cashValueUSD
      }
    })

    return filtered
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTypes(["airline", "hotel", "credit_card"])
    setSelectedRegions([])
    setMinValue("")
    setMaxValue("")
    setSortBy("value")
  }

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    )
  }

  const swapPrograms = () => {
    setSourceProgramId(targetProgramId)
    setTargetProgramId(sourceProgramId)
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatPoints = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`
  }

  const getProgramTypeIcon = (type: string) => {
    switch (type) {
      case "airline":
        return <Plane className="w-4 h-4" />
      case "hotel":
        return <Star className="w-4 h-4" />
      case "credit_card":
        return <CreditCard className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getRegionFlag = (region: string) => {
    switch (region) {
      case "singapore":
        return "🇸🇬"
      case "malaysia":
        return "🇲🇾"
      case "thailand":
        return "🇹🇭"
      case "indonesia":
        return "🇮🇩"
      case "philippines":
        return "🇵🇭"
      case "hong_kong":
        return "🇭🇰"
      case "taiwan":
        return "🇹🇼"
      case "australia":
        return "🇦🇺"
      case "middle_east":
        return "🇦🇪"
      case "asia_pacific":
        return "🌏"
      case "asean":
        return "🌏"
      case "global":
        return "🌍"
      default:
        return "🌍"
    }
  }

  useEffect(() => {
    calculateConversions()
  }, [sourceAmount, sourceProgramId, targetProgramId, selectedCurrency])

  const sourceProgram = getProgram(sourceProgramId)
  const bestValue = conversionResults[0]

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-sm shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Asia Pacific Card Miles Converter
          </h2>
          <p className="text-sm text-gray-500">
            Convert points and miles between loyalty programs across Asia
            Pacific with multi-currency support
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
        {/* Amount Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calculator className="w-4 h-4 inline mr-1" />
            Amount to Convert
          </label>
          <input
            type="number"
            value={sourceAmount}
            onChange={(e) => setSourceAmount(e.target.value)}
            placeholder="Enter points/miles amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Source Program */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Program
          </label>
          <select
            value={sourceProgramId}
            onChange={(e) => setSourceProgramId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <optgroup label="ASEAN Credit Cards">
              {loyaltyPrograms
                .filter(
                  (p) =>
                    p.type === "credit_card" &&
                    (p.region === "singapore" ||
                      p.region === "malaysia" ||
                      p.region === "indonesia")
                )
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Global Credit Cards">
              {loyaltyPrograms
                .filter(
                  (p) => p.type === "credit_card" && p.region === "global"
                )
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="ASEAN Airlines">
              {loyaltyPrograms
                .filter(
                  (p) =>
                    p.type === "airline" &&
                    (p.region === "asean" ||
                      p.region === "singapore" ||
                      p.region === "malaysia" ||
                      p.region === "thailand" ||
                      p.region === "indonesia" ||
                      p.region === "philippines")
                )
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Asia Pacific Airlines">
              {loyaltyPrograms
                .filter(
                  (p) =>
                    p.type === "airline" &&
                    (p.region === "asia_pacific" ||
                      p.region === "australia" ||
                      p.region === "hong_kong" ||
                      p.region === "taiwan")
                )
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Middle East Airlines">
              {loyaltyPrograms
                .filter(
                  (p) => p.type === "airline" && p.region === "middle_east"
                )
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Global Airlines">
              {loyaltyPrograms
                .filter((p) => p.type === "airline" && p.region === "global")
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Hotels">
              {loyaltyPrograms
                .filter((p) => p.type === "hotel")
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Display Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex items-end">
          <button
            onClick={swapPrograms}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Swap</span>
          </button>
        </div>
      </div>

      {/* Quick Search (always visible when there are results) */}
      {conversionResults.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exchange Rate Info */}
      {selectedCurrency !== "USD" && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <Globe className="w-4 h-4" />
            <span>
              Exchange Rate: 1 {selectedCurrency} ={" "}
              {exchangeRates[selectedCurrency].toFixed(4)} USD
            </span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {sourceProgram && sourceAmount && parseFloat(sourceAmount) > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Current Value
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                convertFromUSD(
                  ((parseFloat(sourceAmount) * sourceProgram.cashValue) / 100) *
                    (sourceProgram.baseCurrency === "USD"
                      ? 1
                      : exchangeRates[sourceProgram.baseCurrency]),
                  selectedCurrency
                ),
                selectedCurrency
              )}
            </div>
            <div className="text-xs text-blue-700 flex items-center gap-1">
              {getRegionFlag(sourceProgram.region)} {sourceProgram.cashValue}¢
              per {sourceProgram.currency.slice(0, -1)}
            </div>
          </div>

          {bestValue && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Best Value
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(bestValue.cashValueLocal, selectedCurrency)}
              </div>
              <div className="text-xs text-green-700 flex items-center gap-1">
                {getRegionFlag(bestValue.program.region)}{" "}
                {bestValue.program.name}
              </div>
            </div>
          )}

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                Programs
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {loyaltyPrograms.length}
            </div>
            <div className="text-xs text-purple-700">
              Asia Pacific + Global programs
            </div>
          </div>
        </div>
      )}

      {/* Conversion Results */}
      {conversionResults.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Conversion Results
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showFilters ||
                  selectedTypes.length < 3 ||
                  selectedRegions.length > 0 ||
                  searchTerm ||
                  minValue ||
                  maxValue
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <div className="text-sm text-gray-500">
                {getFilteredAndSortedResults().length} of{" "}
                {conversionResults.length} programs
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`mb-4 space-y-4 ${showFilters ? "block" : "hidden"}`}>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs by name, type, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Program Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Types
                </label>
                <div className="space-y-2">
                  {[
                    { value: "airline", label: "Airlines", icon: "✈️" },
                    { value: "hotel", label: "Hotels", icon: "🏨" },
                    { value: "credit_card", label: "Credit Cards", icon: "💳" },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {type.icon} {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regions
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {[
                    { value: "singapore", label: "Singapore", flag: "🇸🇬" },
                    { value: "malaysia", label: "Malaysia", flag: "🇲🇾" },
                    { value: "thailand", label: "Thailand", flag: "🇹🇭" },
                    { value: "indonesia", label: "Indonesia", flag: "🇮🇩" },
                    { value: "philippines", label: "Philippines", flag: "🇵🇭" },
                    { value: "hong_kong", label: "Hong Kong", flag: "🇭🇰" },
                    { value: "taiwan", label: "Taiwan", flag: "🇹🇼" },
                    { value: "australia", label: "Australia", flag: "🇦🇺" },
                    { value: "middle_east", label: "Middle East", flag: "🇦🇪" },
                    { value: "asean", label: "ASEAN", flag: "🌏" },
                    {
                      value: "asia_pacific",
                      label: "Asia Pacific",
                      flag: "🌏",
                    },
                    { value: "global", label: "Global", flag: "🌍" },
                  ].map((region) => (
                    <label key={region.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region.value)}
                        onChange={() => toggleRegion(region.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {region.flag} {region.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Value Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value Range ({selectedCurrency})
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min value"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max value"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "value" | "name" | "type")
                  }
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="value">Cash Value (High to Low)</option>
                  <option value="name">Program Name (A-Z)</option>
                  <option value="type">Program Type</option>
                </select>
                <button
                  onClick={clearFilters}
                  className="mt-2 w-full px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredAndSortedResults().map((result, index) => {
              // Find the original index for highlighting the best overall value
              const originalIndex = conversionResults.findIndex(
                (r) => r.program.id === result.program.id
              )
              return (
                <div
                  key={result.program.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    originalIndex === 0
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{result.program.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {result.program.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          {getProgramTypeIcon(result.program.type)}
                          <span className="capitalize">
                            {result.program.type.replace("_", " ")}
                          </span>
                          {getRegionFlag(result.program.region)}
                        </div>
                      </div>
                    </div>
                    {originalIndex === 0 && (
                      <Star
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">Amount</div>
                      <div className="font-semibold text-gray-900">
                        {formatPoints(
                          Math.round(result.amount),
                          result.program.currency
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">
                        Cash Value ({selectedCurrency})
                      </div>
                      <div className="font-bold text-lg text-green-600">
                        {formatCurrency(
                          result.cashValueLocal,
                          selectedCurrency
                        )}
                      </div>
                      {selectedCurrency !== "USD" && (
                        <div className="text-xs text-gray-400">
                          {formatCurrency(result.cashValueUSD, "USD")}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-gray-500">
                        {result.program.cashValue}¢ per{" "}
                        {result.program.currency.slice(0, -1)}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${formatPoints(
                              Math.round(result.amount),
                              result.program.currency
                            )} = ${formatCurrency(
                              result.cashValueLocal,
                              selectedCurrency
                            )}`,
                            result.program.id
                          )
                        }
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy conversion"
                      >
                        {copied === result.program.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {result.transferValue &&
                      result.transferValue !== result.amount && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-xs text-blue-600">
                            Transfer: {Math.round(result.transferValue)}{" "}
                            {result.program.currency}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {conversionResults.length > 0 &&
        getFilteredAndSortedResults().length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-lg font-medium">
                No programs match your filters
              </p>
              <p className="text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">
              Asia Pacific Card Miles Converter:
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                • Compare loyalty programs across Asia Pacific region (ASEAN,
                Australia, Hong Kong, Taiwan, Middle East)
              </li>
              <li>
                • Multi-currency support with live exchange rates (SGD, MYR,
                THB, AUD, HKD, TWD, AED, USD)
              </li>
              <li>
                • Major airlines: Singapore Airlines, Cathay Pacific, Qantas,
                EVA Air, Etihad, Qatar Airways, Flying Blue, etc.
              </li>
              <li>
                • Local credit card programs and global programs (DBS, OCBC,
                UOB, Maybank, Amex, Citi, etc.)
              </li>
              <li>• Hotel programs: Marriott, Hilton, IHG, Shangri-La</li>
              <li>
                • Transfer ratios considered for hotel-to-airline conversions
              </li>
              <li>
                • Green highlight shows the program with the highest cash value
                in your selected currency
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
