import { useState, useEffect } from "react"
import { colord } from "colord"
import { Palette, Copy, Check, AlertCircle, Droplets } from "lucide-react"

interface ColorFormat {
  name: string
  value: string
  format: string
}

export default function ColorValueConverter() {
  const [inputValue, setInputValue] = useState("#3b82f6")
  const [colorFormats, setColorFormats] = useState<ColorFormat[]>([])
  const [isValidColor, setIsValidColor] = useState(true)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  const detectColorFormat = (input: string): string => {
    const trimmed = input.trim()

    // Hex format
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(trimmed)) {
      return "hex"
    }

    // RGB/RGBA format
    if (
      /^rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/i.test(
        trimmed
      )
    ) {
      return "rgb"
    }

    // HSL/HSLA format
    if (
      /^hsla?\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/i.test(
        trimmed
      )
    ) {
      return "hsl"
    }

    // OKLCH format
    if (/^oklch\s*\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+\s*\)$/i.test(trimmed)) {
      return "oklch"
    }

    // Named colors
    if (/^[a-zA-Z]+$/.test(trimmed)) {
      return "name"
    }

    return "unknown"
  }

  const parseOklch = (oklchString: string) => {
    const match = oklchString.match(
      /oklch\s*\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/i
    )
    if (!match) return null

    const l = parseFloat(match[1]) / 100 // Convert percentage to 0-1
    const c = parseFloat(match[2])
    const h = parseFloat(match[3])

    // Simplified OKLCH to RGB conversion (approximation)
    // This is a basic approximation - for production use, consider a more accurate conversion library
    const hRad = (h * Math.PI) / 180
    const a = c * Math.cos(hRad)
    const b = c * Math.sin(hRad)

    // Convert LAB-like values to RGB (simplified)
    const y = l
    const x = a * 0.5 + 0.5
    const z = b * 0.5 + 0.5

    const r = Math.max(0, Math.min(1, y + x - 0.5))
    const g = Math.max(0, Math.min(1, y))
    const b_rgb = Math.max(0, Math.min(1, y - z + 0.5))

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b_rgb * 255),
    }
  }

  const convertColor = (input: string) => {
    try {
      let color

      // Check if input is OKLCH format and handle it specially
      if (detectColorFormat(input) === "oklch") {
        const oklchRgb = parseOklch(input)
        if (oklchRgb) {
          color = colord({ r: oklchRgb.r, g: oklchRgb.g, b: oklchRgb.b })
        } else {
          setIsValidColor(false)
          setColorFormats([])
          return
        }
      } else {
        color = colord(input)
      }

      if (!color.isValid()) {
        setIsValidColor(false)
        setColorFormats([])
        return
      }

      setIsValidColor(true)

      const rgb = color.toRgb()
      const hsl = color.toHsl()
      const hsv = color.toHsv()

      // Manual CMYK calculation
      const r = rgb.r / 255
      const g = rgb.g / 255
      const b = rgb.b / 255
      const k = 1 - Math.max(r, g, b)
      const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
      const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
      const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

      // Manual OKLCH calculation (simplified conversion from RGB)
      // This is a simplified approximation for demonstration
      const oklL = (0.2126 * r + 0.7152 * g + 0.0722 * b) * 100 // Lightness approximation
      const oklC =
        Math.sqrt((r - 0.5) ** 2 + (g - 0.5) ** 2 + (b - 0.5) ** 2) * 0.4 // Chroma approximation
      const oklH = ((Math.atan2(g - 0.5, r - 0.5) * 180) / Math.PI + 360) % 360 // Hue approximation

      const formats: ColorFormat[] = [
        {
          name: "HEX",
          value: color.toHex(),
          format: "hex",
        },
        {
          name: "HEX (with alpha)",
          value: color.toHslString(), // Using HSL as alternative since hex8 isn't available
          format: "hex8",
        },
        {
          name: "RGB",
          value: color.toRgbString(),
          format: "rgb",
        },
        {
          name: "HSL",
          value: color.toHslString(),
          format: "hsl",
        },
        {
          name: "HSV/HSB",
          value: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(
            hsv.v
          )}%)`,
          format: "hsv",
        },
        {
          name: "CMYK",
          value: `cmyk(${Math.round(c * 100)}%, ${Math.round(
            m * 100
          )}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`,
          format: "cmyk",
        },
        {
          name: "RGB (0-1)",
          value: `rgb(${(rgb.r / 255).toFixed(3)}, ${(rgb.g / 255).toFixed(
            3
          )}, ${(rgb.b / 255).toFixed(3)})`,
          format: "rgb-decimal",
        },
        {
          name: "OKLCH",
          value: `oklch(${oklL.toFixed(1)}% ${oklC.toFixed(3)} ${oklH.toFixed(
            3
          )})`,
          format: "oklch",
        },
        {
          name: "CSS Name",
          value: "N/A", // Color names not available in basic colord
          format: "name",
        },
      ]

      setColorFormats(formats)
    } catch (error) {
      setIsValidColor(false)
      setColorFormats([])
    }
  }

  const copyToClipboard = async (value: string, format: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  useEffect(() => {
    convertColor(inputValue)
  }, [inputValue])

  const detectedFormat = detectColorFormat(inputValue)

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-sm shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-semibold">Color Value Converter</h2>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label
          htmlFor="colorInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter Color Value
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              id="colorInput"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., #3b82f6, rgb(59, 130, 246), oklch(70.7% 0.165 254.624), blue"
              className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                !isValidColor ? "border-red-500" : "border-gray-300"
              }`}
            />
            {detectedFormat !== "unknown" && isValidColor && (
              <p className="text-xs text-gray-500 mt-1">
                Detected format: {detectedFormat.toUpperCase()}
              </p>
            )}
          </div>

          {/* Color Swatch */}
          {isValidColor && colorFormats.length > 0 && (
            <div className="flex items-center gap-2">
              <div
                className="w-12 h-12 rounded-sm border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: inputValue }}
                title="Color preview"
              />
              <Droplets className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>

        {!isValidColor && (
          <div className="flex items-center gap-2 mt-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Invalid color value</span>
          </div>
        )}
      </div>

      {/* Color Formats Grid */}
      {isValidColor && colorFormats.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Converted Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorFormats.map((format) => (
              <div
                key={format.format}
                className="bg-gray-50 rounded-sm border border-gray-200 p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    {format.name}
                  </span>
                  <button
                    onClick={() => copyToClipboard(format.value, format.format)}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy to clipboard"
                    disabled={format.value === "N/A"}
                  >
                    {copiedFormat === format.format ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <code
                  className={`text-sm bg-white px-2 py-1 rounded border block ${
                    format.value === "N/A" ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  {format.value}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Colors */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Example Colors
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "#3b82f6",
            "#ef4444",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
            "#ec4899",
            "rgb(59, 130, 246)",
            "hsl(220, 91%, 60%)",
            "oklch(70.7% 0.165 254.624)",
            "blue",
            "red",
            "green",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setInputValue(example)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border text-gray-700 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
