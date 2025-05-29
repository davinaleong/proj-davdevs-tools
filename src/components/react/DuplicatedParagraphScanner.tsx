import React, { useState } from "react"

export default function DuplicateParagraphScanner() {
  const [url, setUrl] = useState("")
  const [duplicates, setDuplicates] = useState<string[]>([])
  const [paragraphs, setParagraphs] = useState<string[]>([])
  const [error, setError] = useState("")

  async function handleScan() {
    setError("")
    setDuplicates([])
    setParagraphs([])

    try {
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      )
      if (!response.ok) throw new Error("Failed to fetch content")
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, "text/html")
      const paras = Array.from(doc.querySelectorAll("p")).map(
        (p) => p.textContent?.trim() || ""
      )
      const seen = new Set<string>()
      const dups = new Set<string>()

      paras.forEach((p) => {
        const key = p.toLowerCase()
        if (seen.has(key)) dups.add(p)
        else seen.add(key)
      })

      setParagraphs(paras)
      setDuplicates(Array.from(dups))
    } catch (err) {
      setError(
        "Could not fetch or parse the page. Make sure the site allows cross-origin requests."
      )
    }
  }

  return (
    <section className="space-y-6">
      <p>Enter a website URL to scan for duplicate paragraphs:</p>

      <div className="flex gap-2">
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleScan}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Scan
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {duplicates.length > 0 && (
        <div className="bg-white p-2 rounded shadow-md mt-6">
          <h3 className="text-xl font-semibold">
            🔁 Duplicated Paragraphs Found
          </h3>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {duplicates.map((dup, i) => (
              <li key={i} className="bg-yellow-100 p-2 rounded">
                {dup}
              </li>
            ))}
          </ul>
        </div>
      )}

      {paragraphs.length > 0 && (
        <div className="bg-white p-2 rounded shadow-md mt-6">
          <h3 className="text-xl font-semibold">📄 All Paragraphs</h3>
          <ol className="list-decimal list-inside space-y-2 mt-2">
            {paragraphs.map((para, i) => (
              <li key={i}>{para}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
