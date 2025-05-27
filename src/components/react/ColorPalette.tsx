import React from "react"
import Swatch from "./Swatch"

interface ColorItem {
  title: string
  value: string
  textColor: string
  bgColor: string
}

const basicColors: ColorItem[] = [
  { title: "White", value: "#ffffff", textColor: "#000", bgColor: "#ffffff" },
  { title: "Black", value: "#000000", textColor: "#fff", bgColor: "#000000" },
  { title: "Grey", value: "#888888", textColor: "#fff", bgColor: "#888888" },
  { title: "Red", value: "#ff0000", textColor: "#fff", bgColor: "#ff0000" },
  { title: "Yellow", value: "#fff000", textColor: "#000", bgColor: "#fff000" },
  { title: "Green", value: "#00ff00", textColor: "#000", bgColor: "#00ff00" },
  { title: "Cyan", value: "#00ffff", textColor: "#000", bgColor: "#00ffff" },
  { title: "Blue", value: "#0000ff", textColor: "#fff", bgColor: "#0000ff" },
  { title: "Magenta", value: "#ff00ff", textColor: "#fff", bgColor: "#ff00ff" },
]

export default function ColorPalette() {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">Basic Colors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {basicColors.map((color, index) => (
          <Swatch key={index} {...color} />
        ))}
      </div>
    </section>
  )
}
