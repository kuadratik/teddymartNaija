import {Status} from '@/types/types'
import cx from 'classnames'

interface Props {
  status?: Status
  className?: string
  textClassName?: string
}
function Badge({status, className, textClassName}: Props) {
  const {bg, text} = getColor(status)
  return (
    <p
      style={{
        backgroundColor: bg,
        color: text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 'normal' // Add consistent line height
      }}
      className={cx(
        '!flex w-full min-w-[120px] max-w-[120px] !items-center !justify-center rounded-[4px] bg-opacity-30 p-1 px-6 text-center text-[14px] font-[500] capitalize',
        className
      )}
    >
      <span
        style={{display: 'block'}} // Force block display for PDF compatibility
        className={cx('py-[2px]', textClassName)}
      >
        {status == 'Outofstock' ? 'Out of stock' : status}
      </span>
    </p>
  )
}
function getColor(status?: Status): {bg: string; text: string} {
  switch (status) {
    // case 'Paid':
    //   return {text: '#259240', bg: '#D4FFD9'}
    case 'New':
      return {text: '#FF9500', bg: '#FFFAEA'}
    case 'Shipped':
      return {text: '#044BFD', bg: '#E7F2FF'}
    case 'Cancelled':
    case 'Unavailable':
      return {text: '#FF3B30', bg: '#FFEBEA'}
    case 'Outofstock':
      return {text: '#FF3B30', bg: '#FFEBEA'}

    case 'Draft':
      return {text: '#000141', bg: '#E3F8FF'}
    case 'Delivered':
    case 'Paid':
    case 'Published':
      return {text: '#259240', bg: '#D4FFD9'}

    default:
      return {bg: '#F1BD13', text: ' #FFFFFF'}
  }
}

export default Badge
