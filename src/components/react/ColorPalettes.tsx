import React, { useState } from "react"
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
  const [activeTab, setActiveTab] = useState(0)

  const uniqueTabs = Array.from(
    new Set(groups.map((group) => group.groupTitle.split(" – ")[0]))
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 pb-2">
        {uniqueTabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor:pointer ${
              activeTab === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {groups
        .filter((group) => group.groupTitle.startsWith(uniqueTabs[activeTab]))
        .map((group, index) => (
          <section
            key={index}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
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
