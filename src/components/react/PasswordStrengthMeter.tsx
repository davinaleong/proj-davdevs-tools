import { useState } from "react"

const TYPE_PASSWORD = "password"
const TYPE_TEXT = "text"
const TOTAL_SCORE = 8

function PasswordStrengthMeter() {
  const [passwordFieldType, setPasswordFieldType] = useState(TYPE_PASSWORD)
  const [meterLength, setMeterLength] = useState(0)
  const [meterColour, setMeterColour] = useState("bg-red-500")
  const [password, setPassword] = useState("")

  const togglePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFieldType((prev) =>
      prev === TYPE_PASSWORD ? TYPE_TEXT : TYPE_PASSWORD
    )
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    // Simple strength logic (replace with full evaluator later)
    let score = 0
    if (value.length >= 12) score += 2
    if (/[a-z]/.test(value)) score++
    if (/[A-Z]/.test(value)) score++
    if (/\d/.test(value)) score++
    if (/[^a-zA-Z0-9]/.test(value)) score++
    if (!/\s/.test(value)) score++
    if (!/^([a-zA-Z0-9!@#$%^&*()_+=-])\1+$/.test(value)) score++

    const lengthPercentage = Math.min((score / TOTAL_SCORE) * 100, 100)
    setMeterLength(lengthPercentage)

    if (score <= 2) setMeterColour("bg-red-500")
    else if (score <= 4) setMeterColour("bg-yellow-500")
    else if (score <= 6) setMeterColour("bg-blue-500")
    else setMeterColour("bg-green-500")
  }

  return (
    <form action="" method="post" className="bg-slate-50 shadow-md rounded p-4">
      <div className="grid gap-2">
        <label htmlFor="input-password" className="text-lg">
          Please enter your password:
        </label>
        <input
          type={passwordFieldType}
          name="password"
          id="input-password"
          value={password}
          onChange={handlePasswordChange}
          className="text-lg p-2 border rounded"
        />
        <div className="h-2 w-full bg-gray-300 rounded overflow-hidden mt-2">
          <div
            className={`h-full ${meterColour} transition-all duration-300`}
            style={{ width: `${meterLength}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="input-toggle_password"
          className="flex gap-2 items-center cursor-pointer"
        >
          <input
            type="checkbox"
            name="toggle_password"
            id="input-toggle_password"
            onChange={togglePasswordHandler}
          />
          Toggle Password
        </label>
      </div>
    </form>
  )
}

export default PasswordStrengthMeter
