import { useState } from "react"

export default function PasswordStrengthClient() {
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState("")

  const checkStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    switch (score) {
      case 4:
        return "Very Strong"
      case 3:
        return "Strong"
      case 2:
        return "Moderate"
      case 1:
        return "Weak"
      default:
        return ""
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setPassword(val)
    setStrength(checkStrength(val))
  }

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={handleChange}
        placeholder="Enter password"
        className="w-full border p-2 rounded"
      />
      {strength && (
        <p
          className={`mt-2 font-medium ${
            strength === "Weak"
              ? "text-red-600"
              : strength === "Moderate"
              ? "text-yellow-500"
              : strength === "Strong"
              ? "text-green-500"
              : "text-green-700"
          }`}
        >
          Strength: {strength}
        </p>
      )}
    </div>
  )
}
