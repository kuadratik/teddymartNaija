import {twMerge} from 'tailwind-merge'

interface IProps {
  IconName?: string
  className?: string
}
export const TopHeader = ({IconName, className}: IProps) => {
  return (
    <div className={twMerge('grid grid-cols-3 items-center justify-between', className)}>
      <div className="text-left">dfsds</div>
      <div className="">fdgsdfg</div>
      <div className="text-right">sdfgsdf</div>
    </div>
  )
}
