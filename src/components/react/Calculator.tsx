import { useState } from "react"
import {
  Calculator as CalculatorIcon,
  Percent,
  Plus,
  Minus,
  X,
  Divide,
  Equal,
  SquareChevronLeft,
  Diff,
} from "lucide-react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(`${parseFloat(newValue.toFixed(7))}`)
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperator)
  }

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "%":
        return firstValue % secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(`${parseFloat(newValue.toFixed(7))}`)
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const toggleSign = () => {
    if (display !== "0") {
      setDisplay(display.charAt(0) === "-" ? display.slice(1) : "-" + display)
    }
  }
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-sm shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <CalculatorIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Calculator</h2>
      </div>

      <div className="grid grid-cols-4 grid-rows-7 gap-2">
        <div className="col-span-4 row-span-2 font-semibold text-2xl text-right grid place-items-end p-2 bg-gray-100 rounded-sm overflow-hidden">
          {display}
        </div>
        <button
          onClick={backspace}
          className="cursor-pointer p-3 bg-gray-200 hover:bg-gray-300 rounded-sm flex items-center justify-center"
        >
          <SquareChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={clear}
          className="cursor-pointer p-3 bg-gray-200 hover:bg-gray-300 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">AC</span>
        </button>
        <button
          onClick={() => inputOperator("%")}
          className="cursor-pointer p-3 bg-gray-200 hover:bg-gray-300 rounded-sm flex items-center justify-center"
        >
          <Percent className="w-5 h-5" />
        </button>
        <button
          onClick={() => inputOperator("÷")}
          className="cursor-pointer p-3 bg-blue-200 hover:bg-blue-300 rounded-sm flex items-center justify-center"
        >
          <Divide className="w-5 h-5" />
        </button>
        <button
          onClick={() => inputNumber("7")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">7</span>
        </button>
        <button
          onClick={() => inputNumber("8")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">8</span>
        </button>
        <button
          onClick={() => inputNumber("9")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">9</span>
        </button>
        <button
          onClick={() => inputOperator("×")}
          className="cursor-pointer p-3 bg-blue-200 hover:bg-blue-300 rounded-sm flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
        <button
          onClick={() => inputNumber("4")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">4</span>
        </button>
        <button
          onClick={() => inputNumber("5")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">5</span>
        </button>
        <button
          onClick={() => inputNumber("6")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">6</span>
        </button>
        <button
          onClick={() => inputOperator("-")}
          className="cursor-pointer p-3 bg-blue-200 hover:bg-blue-300 rounded-sm flex items-center justify-center"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() => inputNumber("1")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">1</span>
        </button>
        <button
          onClick={() => inputNumber("2")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">2</span>
        </button>
        <button
          onClick={() => inputNumber("3")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">3</span>
        </button>
        <button
          onClick={() => inputOperator("+")}
          className="cursor-pointer p-3 bg-blue-200 hover:bg-blue-300 rounded-sm flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={toggleSign}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <Diff className="w-5 h-5" />
        </button>
        <button
          onClick={() => inputNumber("0")}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">0</span>
        </button>
        <button
          onClick={inputDecimal}
          className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-sm flex items-center justify-center"
        >
          <span className="font-semibold">.</span>
        </button>
        <button
          onClick={performCalculation}
          className="cursor-pointer p-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center gap-2"
        >
          <Equal className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
