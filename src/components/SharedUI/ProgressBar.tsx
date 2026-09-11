import React from 'react'

const ProgressBar = ({currentStep, totalSteps}: {currentStep: number; totalSteps: number}) => {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="mt-5 flex flex-col md:hidden">
      <div className="ml-auto text-sm font-semibold text-[#3D3D3D]">
        {currentStep} of {totalSteps}
      </div>
      <div className="relative h-2 w-full rounded-full bg-[#E4E4E4]">
        <div className="absolute left-0 top-0 h-2 rounded-full bg-[#33357D]" style={{width: `${percentage}%`}}></div>
      </div>
    </div>
  )
}

export default ProgressBar
