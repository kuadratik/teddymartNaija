import React, {useState} from 'react'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'

const WelcomeSection: React.FC = () => {
  const {admin} = useSuperAdminAuth()
  const userName = admin ? `${admin.first_name}` : 'Admin'
  // Dynamic greeting based on local time
  const [greeting, setGreeting] = useState({
    title: 'Welcome back',
    emoji: '☀️',
    subtext: `Hello ${userName}, have a productive day today!`
  })

  React.useEffect(() => {
    const computeGreeting = () => {
      const now = new Date()
      const hour = now.getHours()
      if (hour >= 5 && hour < 12) {
        return {title: 'Good morning', emoji: '☀️', subtext: `Good morning ${userName}, have a productive day!`}
      }
      if (hour >= 12 && hour < 17) {
        return {
          title: 'Good afternoon',
          emoji: '🌤️',
          subtext: `Good afternoon ${userName}, hope your day is going well!`
        }
      }
      if (hour >= 17 && hour < 21) {
        return {title: 'Good evening', emoji: '🌆', subtext: `Good evening ${userName}, hope you had a great day!`}
      }
      return {title: 'Good night', emoji: '🌙', subtext: `Good night ${userName}, rest well!`}
    }

    const update = () => setGreeting(computeGreeting())
    update()
    const id = setInterval(update, 60 * 1000) // refresh every minute
    return () => clearInterval(id)
  }, [userName])

  return (
    <div className="w-full sm:w-auto">
      <TextComponent
        as="h1"
        className="flex flex-col text-2xl font-semibold leading-tight text-gray-900 sm:flex-row sm:items-center sm:text-[32px]"
      >
        Welcome back,
        <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap align-middle sm:ml-2 sm:max-w-[140px] md:max-w-[260px]">
          {userName}
        </span>
        <span className="ml-2 hidden sm:inline-block">{greeting.emoji}</span>
      </TextComponent>

      <TextComponent as="p" className="mt-2 text-sm font-normal text-gray-500 sm:text-[14px]">
        {greeting.subtext}
      </TextComponent>
    </div>
  )
}

export default WelcomeSection
