import React, { useState } from "react"
import zxcvbn from "zxcvbn"

const symbols = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "+",
  "-",
  "=",
  "{",
  "}",
  "[",
  "]",
  ":",
  ";",
  ".",
  "?",
]

const foreignWords: Record<string, string> = {
  journey: "voyage", // French
  light: "lumière", // French (we'll convert it to alphabetic)
  dream: "sueño", // Spanish
  world: "mundo", // Spanish
  peace: "salem", // Hebrew
}

function spellOut(word: string): string {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
}

export default function PasswordCreator() {
  const [password, setPassword] = useState("")
  const [crackTime, setCrackTime] = useState("")

  const generatePassword = () => {
    // Step 1: List of long phrases
    const phrases = [
      "embrace the beauty of the journey and never stop learning or dreaming",
      "the light of understanding shines brightest when shared with the world",
      "peaceful hearts create powerful change in chaotic times",
      "follow the rhythm of your heart and let passion guide your path",
      "every challenge is a step closer to strength and wisdom",
    ]
    let phrase = phrases[Math.floor(Math.random() * phrases.length)]

    // Step 2: Randomly capitalize 2–4 words
    const words = phrase.split(" ")
    const toCapCount = Math.floor(Math.random() * 3) + 2
    const indexesToCap = new Set<number>()
    while (indexesToCap.size < toCapCount) {
      indexesToCap.add(Math.floor(Math.random() * words.length))
    }

    const capitalizedPhrase = words
      .map((word, index) =>
        indexesToCap.has(index)
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word
      )
      .join("")

    // Step 3: Replace a word in the phrase with a foreign word if present
    const foreignWords: Record<string, string> = {
      journey: "voyage",
      light: "lumière",
      dream: "sueño",
      world: "mundo",
      peace: "salem",
      challenge: "reto",
      strength: "forza",
      heart: "corazón",
    }

    let replaced = capitalizedPhrase
    for (const [en, foreign] of Object.entries(foreignWords)) {
      const regex = new RegExp(en, "i")
      if (regex.test(replaced)) {
        replaced = replaced.replace(regex, spellOut(foreign))
        break
      }
    }

    // Step 4: Add a symbol
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]

    // Step 5: Add 2–3 digits
    const number = Math.floor(Math.random() * 900 + 100) // 100–999

    const finalPassword = `${replaced}${symbol}${number}`
    setPassword(finalPassword)

    // Step 6: Crack time estimate
    const result = zxcvbn(finalPassword)
    setCrackTime(result.crack_times_display.offline_slow_hashing_1e4_per_second)
  }

  return (
    <section className="space-y-4 p-4 border rounded bg-gray-50 dark:bg-gray-900 dark:text-white">
      <h3 className="text-2xl font-semibold">
        🔑 Generate a Secure, Memorable Password
      </h3>
      <p>
        This tool builds a strong password based on an expressive phrase with
        creative modifications.
      </p>
      <button
        onClick={generatePassword}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Generate Password
      </button>
      {password && (
        <div className="mt-4">
          <p className="text-lg font-mono break-words">
            <strong>🔐 Your Password:</strong> {password}
          </p>
          <p className="mt-2">
            🛡️ Estimated Crack Time: <strong>{crackTime}</strong>
          </p>
        </div>
      )}
    </section>
  )
}
