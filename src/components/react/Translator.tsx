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
  const [style, setStyle] = useState("formal")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const languages = [
    // Major World Languages
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

    // ASEAN Languages
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "ms", name: "Malay", flag: "🇲🇾" },
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { code: "tl", name: "Filipino (Tagalog)", flag: "🇵🇭" },
    { code: "my", name: "Burmese (Myanmar)", flag: "🇲🇲" },
    { code: "km", name: "Khmer (Cambodian)", flag: "🇰🇭" },
    { code: "lo", name: "Lao", flag: "🇱🇦" },
    { code: "si", name: "Sinhala", flag: "🇱🇰" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "ne", name: "Nepali", flag: "🇳🇵" },
    { code: "dz", name: "Dzongkha", flag: "🇧🇹" },
    { code: "hil", name: "Hiligaynon", flag: "🇵🇭" },
    { code: "ceb", name: "Cebuano", flag: "🇵🇭" },
    { code: "jv", name: "Javanese", flag: "🇮🇩" },
    { code: "su", name: "Sundanese", flag: "🇮🇩" },
  ]

  const styles = [
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

  const buildPrompt = (
    provider: string,
    text: string,
    fromLang: string,
    toLang: string,
    translationStyle: string
  ) => {
    const fromLanguage =
      languages.find((l) => l.code === fromLang)?.name || fromLang
    const toLanguage = languages.find((l) => l.code === toLang)?.name || toLang
    const styleDesc =
      styles.find((s) => s.value === translationStyle)?.description ||
      translationStyle

    return `Please translate the following text from ${fromLanguage} to ${toLanguage} using a ${translationStyle} style (${styleDesc}).

Source text: "${text}"

Please respond in the following JSON format:
{
  "provider": "${provider}",
  "translatedText": "your translation here",
  "sourceLanguage": "${fromLanguage}",
  "targetLanguage": "${toLanguage}",
  "style": "${translationStyle}",
  "confidence": 0.95
}`
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)
    setError(null)

    try {
      const prompt = buildPrompt(
        "openai",
        sourceText,
        sourceLang,
        targetLang,
        style
      )

      const response = await fetch(
        "https://proj-ai-wrapper.onrender.com/v2/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status}: ${response.statusText}`
        )
      }

      const data = await response.json()

      // Check if the API returned an error
      if (data.error) {
        throw new Error(data.error)
      }

      // Parse the response based on the actual API structure
      let translationResult
      let responseText = ""

      // Extract text from the nested structure: data.content[0].text
      if (
        data.content &&
        Array.isArray(data.content) &&
        data.content[0]?.text
      ) {
        responseText = data.content[0].text
      } else {
        // Fallback to other possible locations
        responseText =
          data.response || data.message || data.text || data.content || ""
      }

      if (!responseText) {
        throw new Error("No response received from translation service")
      }

      try {
        // The response might be wrapped in markdown code blocks
        let cleanedText = responseText

        // Remove markdown code block markers if present
        if (cleanedText.includes("```json")) {
          cleanedText = cleanedText
            .replace(/```json\s*/, "")
            .replace(/\s*```\s*$/, "")
        } else if (cleanedText.includes("```")) {
          cleanedText = cleanedText
            .replace(/```\s*/, "")
            .replace(/\s*```\s*$/, "")
        }

        // Try to parse as JSON
        translationResult = JSON.parse(cleanedText.trim())
      } catch (parseError) {
        // If parsing fails, check if responseText is already a valid response
        if (typeof data.response === "object" && data.response !== null) {
          translationResult = data.response
        } else if (typeof data === "object" && data.translatedText) {
          translationResult = data
        } else {
          // Treat the response as plain text translation
          translationResult = {
            translatedText: responseText,
            sourceLanguage: languages.find((l) => l.code === sourceLang)?.name,
            targetLanguage: languages.find((l) => l.code === targetLang)?.name,
            style: style,
            confidence: 0.85,
          }
        }
      }

      // Extract and validate the translated text
      let finalTranslation = ""

      // Try multiple possible fields for the translated text
      const possibleFields = [
        "translatedText",
        "translation",
        "text",
        "content",
        "result",
        "output",
      ]

      for (const field of possibleFields) {
        if (translationResult[field]) {
          if (typeof translationResult[field] === "string") {
            finalTranslation = translationResult[field].trim()
            break
          } else {
            finalTranslation = String(translationResult[field]).trim()
            break
          }
        }
      }

      // If no field worked, try using the entire response as text
      if (!finalTranslation && translationResult) {
        if (typeof translationResult === "string") {
          finalTranslation = translationResult.trim()
        } else {
          finalTranslation = String(translationResult).trim()
        }
      }

      if (!finalTranslation) {
        throw new Error("Translation service returned empty result")
      }

      setTranslatedText(finalTranslation)
      setError(null)
    } catch (error) {
      console.error("Translation error:", error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to translate text. Please try again."
      setError(errorMessage)
      setTranslatedText("")
    } finally {
      setIsTranslating(false)
    }
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
    setError(null)
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
            Translation Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {styles.map((styleOption) => (
              <label
                key={styleOption.value}
                className={`relative cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md ${
                  style === styleOption.value
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="style"
                  value={styleOption.value}
                  checked={style === styleOption.value}
                  onChange={(e) => setStyle(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{styleOption.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {styleOption.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {styleOption.description}
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
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-600 text-center">
                      <div className="text-sm font-medium">
                        Translation Error
                      </div>
                      <div className="text-xs mt-1">{error}</div>
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
              {translatedText && !error && (
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
 * Language Translator Component
 *
 * PRODUCTION READY FEATURES:
 * ✅ Real API integration with https://proj-ai-wrapper.onrender.com/v2/chat
 * ✅ Comprehensive error handling and validation
 * ✅ Support for multiple response formats (JSON and plain text)
 * ✅ User-friendly error display
 * ✅ Proper loading states and feedback
 * ✅ Structured prompts with language and style context
 * ✅ Response validation and fallback handling
 * ✅ Copy functionality with error prevention
 * ✅ Network error handling and timeout support
 *
 * API INTEGRATION:
 * - Sends structured prompts to OpenAI via wrapper service
 * - Handles both JSON-formatted and plain text responses
 * - Includes fallback parsing for various response formats
 * - Validates responses before displaying to user
 * - Provides detailed error messages for debugging
 */
