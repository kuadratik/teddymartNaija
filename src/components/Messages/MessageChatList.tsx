import {Icon} from '@iconify/react'
import dayjs from 'dayjs'
import {useMemo} from 'react'
import {userTimezone} from './ChatComponent'

interface IProps {
  messagesContainerRef: any
  chatMessageIsLoading: boolean
  combinedMessages: any
  chatMessageDetailsData: any
  chatMessageDetailsIsSuccess: boolean
  activeTypingUsers: any
  selectedStores: any
  selectedUserChat: any
  isLoadingSentMessages: boolean
}

const MessageChatList = ({
  messagesContainerRef,
  chatMessageIsLoading,
  combinedMessages,
  chatMessageDetailsData,
  chatMessageDetailsIsSuccess,
  activeTypingUsers,
  selectedStores,
  isLoadingSentMessages,
  selectedUserChat
}: IProps) => {
  const formatDate = (timestamp: string) => {
    // Convert to start of day in user's timezone to ensure consistent grouping
    return dayjs(timestamp).tz(userTimezone).startOf('day').format('dddd, MMM DD, YYYY')
  }
  const messagesList = useMemo(() => {
    const groupedByDate: {[key: string]: any[]} = {}

    // First, group messages by date
    combinedMessages.forEach((message: any) => {
      const messageDate = formatDate(message.timestamp)
      if (!groupedByDate[messageDate]) {
        groupedByDate[messageDate] = []
      }
      groupedByDate[messageDate].push(message)
    })

    const finalMessages: any[] = []

    // Sort dates in reverse chronological order
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime()
    })

    sortedDates.forEach(date => {
      const messages = groupedByDate[date]
      const messagesForDate: any[] = []

      // Add all messages for this date
      messages.forEach((message: any, index: number) => {
        const isSender = message.isSender
        const participant = chatMessageDetailsData?.data?.participants.find((p: any) => p.user_id === message.user_id)
        const fullName = participant
          ? `${participant?.user?.last_name} ${participant?.user?.first_name}`
          : selectedUserChat?.respondent
            ? `${selectedUserChat?.respondent?.last_name} ${selectedUserChat?.respondent?.first_name}`
            : 'Unknown User'

        messagesForDate.push(
          <div key={`message-${message.id}-${index}`} className="w-full">
            <div
              className={`mb-4 flex w-full items-center gap-2 lg:w-1/2 ${
                isSender ? 'float-right justify-end' : 'justify-start'
              }`}
            >
              {!isSender && (
                <div
                  className={`flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#D9D9D9] shadow-lg sm:h-[35px] sm:w-[35px] md:h-[40px] md:w-[40px]`}
                >
                  <Icon icon="mingcute:user-4-fill" className="text-3xl text-black" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-3 py-1 ${
                  isSender
                    ? `rounded-tr-none ${message?.failed ? 'bg-red-500' : 'bg-[#41464f]'} text-white`
                    : 'rounded-tl-none bg-[#EFEFEF] text-black'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-right text-xs opacity-70">
                    {dayjs.utc(message.timestamp).tz(userTimezone).format('hh:mm A')} {message?.failed && '🥹'}
                  </span>
                  <span>
                    {chatMessageDetailsIsSuccess && !message?.failed ? (
                      <Icon icon="solar:check-read-outline" className="text-[20px] text-green-500" />
                    ) : null}
                  </span>
                </div>
              </div>
              {isSender && (
                <div
                  className={`flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black/80 shadow-lg sm:h-[35px] sm:w-[35px] md:h-[40px] md:w-[40px]`}
                >
                  <Icon icon="mingcute:user-4-fill" className="text-3xl text-white" />
                </div>
              )}
            </div>
          </div>
        )
      })

      // Add messages first, then the date header at the bottom
      finalMessages.push(...messagesForDate)

      // Add date header at the bottom of the group
      finalMessages.push(
        <div key={`date-${date}`} className="my-4 flex items-center justify-center">
          <div className="rounded-full px-4 py-1 text-xs font-semibold text-[#6B7280]">{date}</div>
        </div>
      )
    })

    return finalMessages
  }, [combinedMessages, chatMessageDetailsData, chatMessageDetailsIsSuccess, selectedUserChat, userTimezone])

  return (
    <div
      id="scrollableDiv"
      ref={messagesContainerRef}
      style={{scrollBehavior: 'smooth'}}
      className="flex min-h-screen flex-col gap-4 pb-[0px] lg:min-h-full"
    >
      <>{messagesList}</>
    </div>
  )
}

export default MessageChatList
