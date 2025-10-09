import { useState } from "react"
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  Globe,
  MessageCircle,
  Sparkles,
} from "lucide-react"

export default function Translator() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("es")
  const [tone, setTone] = useState("formal")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
  ]

  const tones = [
    {
      value: "formal",
      label: "Formal",
      icon: "👔",
      description: "Professional and respectful",
    },
    {
      value: "informal",
      label: "Informal",
      icon: "😊",
      description: "Casual and relaxed",
    },
    {
      value: "friendly",
      label: "Friendly",
      icon: "🤝",
      description: "Warm and approachable",
    },
    {
      value: "academic",
      label: "Academic",
      icon: "🎓",
      description: "Scholarly and precise",
    },
  ]

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)
    // Simulate API call
    setTimeout(() => {
      setTranslatedText(`[${tone.toUpperCase()}] Translated: ${sourceText}`)
      setIsTranslating(false)
    }, 1500)
  }

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const clearAll = () => {
    setSourceText("")
    setTranslatedText("")
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-sm shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Languages className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Language Translator
          </h2>
          <p className="text-sm text-gray-500">
            Translate text between languages with different tones
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleTranslate()
        }}
        className="space-y-6"
      >
        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Source Language */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              From
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={swapLanguages}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Swap languages"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Target Language */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              To
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <MessageCircle className="w-4 h-4 inline mr-1" />
            Translation Tone
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tones.map((toneOption) => (
              <label
                key={toneOption.value}
                className={`relative cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md ${
                  tone === toneOption.value
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={toneOption.value}
                  checked={tone === toneOption.value}
                  onChange={(e) => setTone(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{toneOption.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {toneOption.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {toneOption.description}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Text to translate
              </span>
            </label>
            <div className="relative">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={8}
                placeholder="Enter your text here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {sourceText.length} characters
              </div>
            </div>
          </div>

          {/* Translated Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-1">
                <Languages className="w-4 h-4" />
                Translation
              </span>
            </label>
            <div className="relative">
              <div className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Translating...</span>
                    </div>
                  </div>
                ) : translatedText ? (
                  <div className="text-gray-900">{translatedText}</div>
                ) : (
                  <div className="text-gray-400 italic">
                    Translation will appear here...
                  </div>
                )}
              </div>
              {translatedText && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Copy translation"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Listen to translation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={clearAll}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear All
          </button>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!sourceText.trim() || isTranslating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isTranslating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  Translate
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

/*
https://proj-ai-wrapper.onrender.com/v2/chat
body:
{
    "provider": "openai",
    "prompt": "What model are you?"
}
*/

/**
 * TODO:
 * - Come up with better name for "tone"
 * - Put the from language, to language and tone in the prompt
 * - Come up with a format to send to the API in the "prompt" field so that the response format is fixed
 * - Implement real API call
 * - Extract content from the response and display properly
 */
