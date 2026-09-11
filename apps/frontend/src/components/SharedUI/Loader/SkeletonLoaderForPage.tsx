import React from 'react'
interface IProps {
  length?: number
}
const SkeletonLoaderForPage = ({length}: IProps) => {
  return (
    <div className="mt-0 animate-pulse p-5 pb-0">
      <div className="mb-5 h-56 w-full rounded bg-gray-200"></div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-5 h-16 w-full rounded bg-gray-200"></div>
      ))}
    </div>
  )
}

export default SkeletonLoaderForPage
