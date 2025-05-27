import React from "react"
import Swatch from "./Swatch"

export interface ColorItem {
  title: string
  value: string
  textColor: string
  bgColor: string
}

interface ColorPaletteProps {
  title?: string
  colors: ColorItem[]
}

export default function ColorPalette({
  title = "Color Palette",
  colors,
}: ColorPaletteProps) {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <Swatch key={index} {...color} />
        ))}
      </div>
    </section>
  )
}
