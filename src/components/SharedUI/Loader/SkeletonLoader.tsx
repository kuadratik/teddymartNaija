interface IProps {
  length: number
}

const SkeletonLoader = ({length}: IProps) => {
  return (
    <div className="mt-0 animate-pulse p-5 pb-0">
      <div className="mb-5 h-56 w-full rounded bg-gray-200"></div>
      <div className="grid gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mb-5 h-[200px] w-full rounded bg-gray-200"></div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonLoader
