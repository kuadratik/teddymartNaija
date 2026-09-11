import React, {useEffect} from 'react'
import EmptyData from './EmptyData'
import {useLocalStorage} from 'react-use'
import {useRouter} from 'next/router'
import TextComponent from './TextComponent'

const EmptyClip = () => {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center">
      {' '}
      <EmptyData
        textNode={
          <div>
            <TextComponent as="p" className="text-xs">
              Your cart is empty.
            </TextComponent>
            <TextComponent as="p" className="text-xs">
              Check out what's trending
            </TextComponent>
          </div>
        }
        title="Your cart is empty"
        btnTitle={'Find Products'}
        btnAction={() => {
          router.push(`/search`)
        }}
      />
    </div>
  )
}

export default EmptyClip
