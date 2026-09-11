import {clearMessages} from '@/redux/features/chatSlice'
import {toggleMobileChatMessageModal} from '@/redux/features/messagingSlice'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import Image from 'next/image'
import Link from 'next/link'
import TextInput from '../SharedUI/Input/TextInput'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
// Customize the relative time thresholds
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'secs', // instead of 'a few seconds'
    m: '1m', // instead of 'a minute'
    mm: '%dm', // instead of 'X minutes'
    h: '1h', // instead of 'an hour'
    hh: '%dh', // instead of 'X hours'
    d: '1d', // instead of 'a day'
    dd: '%dd', // instead of 'X days'
    M: '1mo', // instead of 'a month'
    MM: '%dmo', // instead of 'X months'
    y: '1y', // instead of 'a year'
    yy: '%dy' // instead of 'X years'
  }
})
interface IProps {
  data: any
  selectedUserChat: any
  setSelectedUserChat: any
  isLoading: boolean
  dispatch: any
  isLoadingStartConversation: boolean
  isLoadingSentMessage: boolean
  setSearch: any
  search: string
  activeTypingUsers: any
  selectedStores: any
  refetch: any
  setCombinedMessages: any
  scrollToBottom: any
  setHideIsFetching: any
  handleReadReceipt: () => void
  receivedMessage: any
  refetchConversations: any
}
const SideChatList = ({
  data,
  selectedUserChat,
  setSelectedUserChat,
  isLoading,
  dispatch,
  isLoadingSentMessage,
  isLoadingStartConversation,
  setSearch,
  activeTypingUsers,
  selectedStores,
  search,
  setCombinedMessages,
  refetch,
  scrollToBottom,
  setHideIsFetching,
  handleReadReceipt,
  receivedMessage,
  refetchConversations
}: IProps) => {
  return (
    <div className="relative max-h-[560px] overflow-y-scroll lg:max-h-[460px]">
      <>
        <div className="sticky top-0 z-30 w-full bg-white px-2 py-2">
          <TextInput
            name="search"
            placeholder="search"
            onChange={e => setSearch(e.target.value)}
            value={search}
            type="text"
            className="py-2"
          />
        </div>
        {(data as any)?.data?.length > 0 ? (
          <>
            {[...(data?.data ?? [])]
              .filter((item: any) => item.respondent !== null) // Filter out items with null respondent
              .sort(
                (a: any, b: any) =>
                  new Date(b?.lastMessage?.created_at).getTime() - new Date(a?.lastMessage?.created_at).getTime()
              )
              .map((item: any) => {
                const isSelected = selectedUserChat?.respondent?.user_id === item?.respondent?.user_id

                const fullName = (item as any)?.respondent?.last_name + ' ' + (item as any)?.respondent?.first_name

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      const url = new URL(window.location.href)
                      url.searchParams.delete('userId')
                      window.history.replaceState({}, '', url.pathname)
                      setHideIsFetching(true)
                      setSelectedUserChat(item)
                      dispatch(clearMessages())
                      setCombinedMessages((prevMessages: any) =>
                        prevMessages.filter((message: any) => !message.isWebSocket)
                      )
                      dispatch(toggleMobileChatMessageModal())

                      scrollToBottom()
                      if (selectedUserChat?.lastMessage?.chat_id && selectedUserChat?.unread > 0) {
                        handleReadReceipt()
                      }
                      // refetch()
                      refetchConversations()
                    }}
                    className={`flex cursor-pointer items-center justify-between gap-2 border-b-2 border-[#F1F5F9] p-2 hover:opacity-70 sm:gap-4 sm:p-3 ${
                      isSelected ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="relative w-fit">
                      <div
                        className={`flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black shadow-lg sm:h-[35px] sm:w-[35px] md:h-[40px] md:w-[40px]`}
                      >
                        {/* <p className="text-white">{userInitials}</p> */}
                        <Icon icon="mingcute:user-4-fill" className="text-3xl text-white" />
                      </div>
                      {activeTypingUsers.includes(item?.respondent?.user_id.toString()) && (
                        <div className="absolute bottom-0 right-1 z-20 h-2 w-2 rounded-full border border-white bg-[#34C759] shadow-f2 sm:h-2 sm:w-2" />
                      )}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-1 sm:gap-2">
                        <h3 className="text-[12px] font-semibold capitalize text-[#2D2D2D] sm:text-[13px] md:text-[14px]">
                          {`${(item as any)?.respondent ? fullName : 'You'}`}
                        </h3>
                        <p className="whitespace-normal text-[10px] font-[500] text-[#6B7280] sm:text-[11px] md:text-[12px]">
                          {capitalizeOnlyFirstLetter(dayjs(item?.lastMessage.created_at).fromNow())}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-1 sm:gap-2">
                        <p className="max-w-[150px] truncate text-[10px] text-[#6B7280] sm:max-w-[200px] sm:text-[11px] md:max-w-none">
                          {activeTypingUsers.includes(item?.respondent?.user_id.toString()) ? (
                            <span className="text-xs italic text-green-500">typing...</span>
                          ) : (
                            <>
                              {isLoadingSentMessage &&
                              selectedUserChat?.respondent?.user_id === item?.respondent?.user_id ? (
                                <span className="italic">sending...</span>
                              ) : isLoadingStartConversation &&
                                selectedUserChat?.respondent?.user_id === item?.respondent?.user_id ? (
                                <span className="italic">sending...</span>
                              ) : (
                                (() => {
                                  // Find the most recent message for this chat from receivedMessage
                                  const recentReceivedMessage = receivedMessage
                                    .filter((msg: any) => msg.chat_id === item.id)
                                    .sort(
                                      (a: any, b: any) =>
                                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                                    )[0]

                                  // Compare timestamps to determine which message is more recent
                                  const lastMessageTime = new Date(item?.lastMessage?.created_at).getTime()
                                  const receivedMessageTime = recentReceivedMessage
                                    ? new Date(recentReceivedMessage.timestamp).getTime()
                                    : 0

                                  // Use the more recent message
                                  const messageContent =
                                    receivedMessageTime > lastMessageTime
                                      ? recentReceivedMessage?.message
                                      : item?.lastMessage?.content

                                  return messageContent?.length > 25
                                    ? messageContent.slice(0, 25) + '...'
                                    : messageContent
                                })()
                              )}
                            </>
                          )}
                        </p>

                        {item?.unread > 0 && (
                          <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#000000] p-[2px]">
                            <p className="text-[9px] text-white sm:text-[10px]">{item?.unread}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </>
        ) : (
          <div className="relative flex h-full min-h-[400px] w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <Image src={'/assets/chat-icon.svg'} width={100} height={100} className="mb-2" alt="Empty chat" />
              <h3 className="hidden text-center font-semibold text-[#6B7280] lg:block">Nothing to see here</h3>
              <Link
                href={'/find-vendor'}
                className="px-5 text-center font-[500] text-[#6B7280] hover:text-[#6B7280] hover:opacity-80 lg:hidden"
              >
                Please <span className="font-bold text-blue-500 underline">click here</span> to find a vendor and start
                a conversation.{' '}
              </Link>
            </div>
          </div>
        )}
      </>
    </div>
  )
}

export default SideChatList
