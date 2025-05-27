import React from "react"
import Swatch from "./Swatch"

export interface ColorItem {
  title: string
  value: string
  textColor: string
  bgColor: string
}

export interface ColorGroup {
  groupTitle: string
  colors: ColorItem[]
}

interface ColorPalettesProps {
  groups: ColorGroup[]
}

export default function ColorPalettes({ groups }: ColorPalettesProps) {
  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => (
        <section
          key={groupIndex}
          className="p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-4">{group.groupTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {group.colors.map((color, colorIndex) => (
              <Swatch key={colorIndex} {...color} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
