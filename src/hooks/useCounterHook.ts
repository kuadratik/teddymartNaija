import {useEffect, useState} from 'react'

export const CountdownTimer = ({initialMinutes = 5}: {initialMinutes: number}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [timerFinished, setTimerFinished] = useState(false)
  const [key, setKey] = useState(0) // To force a re-render when the timer is reset

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          clearInterval(intervalId)
          setTimerFinished(true)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const handleResendClick = () => {
    setTimeLeft(initialMinutes * 60) // Reset the timer
    setTimerFinished(false) // Hide the resend button
    setKey(prevKey => prevKey + 1) // Force the useEffect to re-run
  }

  return {minutes, seconds, timerFinished, handleResendClick}
}
