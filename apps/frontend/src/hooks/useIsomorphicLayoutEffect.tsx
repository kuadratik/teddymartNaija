import {useEffect, useLayoutEffect} from 'react'

// Use useLayoutEffect in browsers and useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
