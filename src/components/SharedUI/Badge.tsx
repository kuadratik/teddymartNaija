import React from 'react'

import cx from 'classnames'
import {Status} from '@/types/types'

interface Props {
  status?: Status
  className?: string
}
function Badge({status, className}: Props) {
  const {bg, text} = getColor(status)
  return (
    <div
      style={{backgroundColor: bg, color: text}}
      className={cx('rounded-[4px] bg-opacity-30 p-1 text-center text-[14px] font-normal', className)}
    >
      {status}
    </div>
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
    case 'Paid':
      return {text: '#FF938D', bg: '#FFEBEA'}
    case 'Delivered':
      return {text: '#259240', bg: '#D4FFD9'}

    default:
      return {bg: '#F1BD13', text: ' #FFFFFF'}
  }
}

export default Badge
