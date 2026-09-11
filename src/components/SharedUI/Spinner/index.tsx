const Spinner = ({className, style}: {className?: string; style?: React.CSSProperties}) => {
  return (
    <span className="flex items-center justify-center">
      <span style={style} className={`h-5 w-5 animate-spin rounded-full border-b-2 ${className}`}></span>
    </span>
  )
}

export default Spinner
