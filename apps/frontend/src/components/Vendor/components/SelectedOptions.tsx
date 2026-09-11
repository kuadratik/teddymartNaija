import {Icon} from '@iconify/react'

type SelectedOptionProps = {
  text: string
  onClick?: Function
  showDeleteIcon?: boolean
  className?: string
  width?: string
  height?: string
  method: {name: string; id: number}
  onRemove: (category: {name: string; id: number}) => void
}

const SelectedOptions = ({
  text,
  onClick,
  showDeleteIcon = true,
  className,
  onRemove,
  method,
  width = 'w-[153px] ',
  height = 'h-[40px]'
}: SelectedOptionProps) => {
  return (
    <div
      onClick={() => onRemove(method)}
      className={`mb-4 mr-2 flex ${height} ${width} cursor-pointer items-center justify-between gap-4 bg-[#EBF4F9] px-3 py-2 ${className} group`}
    >
      <span className="text-[12px] capitalize leading-[23px] text-[#0077B5]">{text}</span>
      {showDeleteIcon && (
        <div
          onClick={e => {
            e.stopPropagation() // Prevent triggering the div's onClick
            onClick && onClick()
          }}
          className="relative text-[12px] text-[#0077B5]"
        >
          <Icon
            onClick={() => onRemove(method)}
            icon="ic:round-close"
            className="text-[16px] text-[#0077B5] transition-colors duration-200 group-hover:text-[#D22966]"
          />
        </div>
      )}
    </div>
  )
}

export default SelectedOptions
