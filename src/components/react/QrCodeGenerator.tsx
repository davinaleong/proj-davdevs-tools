import { useState } from "react"
import { QRCode } from "react-qrcode-logo"

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com")
  const [size, setSize] = useState(200)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">QR Code Generator</h1>

      <div className="w-full flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="font-medium">Text / URL:</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Size (px):</span>
          <input
            type="number"
            min="50"
            max="1000"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Foreground Color:</span>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="p-1"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Background Color:</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="p-1"
          />
        </label>
      </div>

      <div className="p-4 border rounded bg-white">
        <QRCode
          value={text}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          quietZone={10}
        />
      </div>
    </div>
  )
}
