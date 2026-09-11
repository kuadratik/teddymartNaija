import React from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, className = '' }) => {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 w-full bg-gray-200">
        <div
          className="h-2 bg-black transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar