// src/components/Swatch.tsx
import React from "react"

interface SwatchProps {
  title: string
  value: string
  textColor: string
  bgColor: string
}

function hexToRgb(hex: string): string {
  const value = hex.replace("#", "")
  const bigint = parseInt(value, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgb(${r}, ${g}, ${b})`
}

function hexToHsl(hex: string): string {
  const value = hex.replace("#", "")
  let r = parseInt(value.substring(0, 2), 16) / 255
  let g = parseInt(value.substring(2, 4), 16) / 255
  let b = parseInt(value.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`
}

export default function Swatch({
  title,
  value,
  textColor,
  bgColor,
}: SwatchProps) {
  const rgb = hexToRgb(value)
  const hsl = hexToHsl(value)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied ${text} to clipboard`)
    })
  }

  return (
    <div
      className="p-4 rounded shadow text-center cursor-pointer transition hover:scale-105"
      style={{ color: textColor, backgroundColor: bgColor }}
    >
      <div className="font-semibold">{title}</div>

      <div
        className="text-sm mt-1 hover:underline"
        onClick={() => handleCopy(value)}
      >
        HEX: {value}
      </div>
      <div className="text-sm hover:underline" onClick={() => handleCopy(rgb)}>
        RGB: {rgb}
      </div>
      <div className="text-sm hover:underline" onClick={() => handleCopy(hsl)}>
        HSL: {hsl}
      </div>
    </div>
  )
}
