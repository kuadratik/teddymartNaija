import useWindowResize from '@/hooks/useWindowResize'
import {Icon} from '@iconify/react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import InfiniteScroll from 'react-infinite-scroll-component'
import TextAreaInput from '../SharedUI/Input/TextAreaInput'
import MessageChatList from './MessageChatList'
// Store the timezone once at component level
// Extend dayjs with UTC plugin
dayjs.extend(utc)
dayjs.extend(timezone)
interface Props {
  selectedUserChat: any
  setIsModalOpen: any
  userInitials: string
  chatMessageDetailsData: any
  handleScroll: any
  isNearTop: boolean
  isLoadingMore: boolean
  hasMoreMessages: any
  fetchMessages: any
  setSelectedUserChat: any
  combinedMessages: any
  handleExchangeMessage: any
  handleStartConversationMessage: any
  formValues: any
  handleInputChange: any
  chatMessageDetailsIsSuccess: boolean
  messagesContainerRef: any
  chatMessageIsLoading: any
  activeTypingUsers: any
  selectedStores: any
  isLoadingStartConversation: boolean
  isLoadingSentMessage: boolean
  activeUserData: any
  chatMessageIsFetching: boolean
  scrollableBottomRef: any
  hideIsFetching: boolean
  scrollToBottom: () => void
}
export const userTimezone = dayjs.tz.guess()
export const getInitials = (firstName: string, lastName: string) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${firstInitial}${lastInitial}`
}

const ChatComponent = ({
  selectedUserChat,
  setIsModalOpen,
  userInitials,
  chatMessageDetailsData,
  fetchMessages,
  handleScroll,
  hasMoreMessages,
  isLoadingMore,
  isNearTop,
  setSelectedUserChat,
  combinedMessages,
  chatMessageDetailsIsSuccess,
  chatMessageIsLoading,
  formValues,
  handleExchangeMessage,
  handleInputChange,
  handleStartConversationMessage,
  messagesContainerRef,
  selectedStores,
  activeTypingUsers,
  chatMessageIsFetching,
  isLoadingSentMessage,
  activeUserData,
  isLoadingStartConversation,
  scrollableBottomRef,
  hideIsFetching,
  scrollToBottom
}: Props) => {
  const {width: windowWidth} = useWindowResize()
  return (
    <>
      <div className="relative flex h-full w-full flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-30 flex-shrink-0 border-b border-gray-200 bg-white px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon
                onClick={() => setIsModalOpen(false)}
                icon="mingcute:arrow-left-line"
                width="24"
                height="24"
                className="lg:hidden"
              />
              <div className="relative w-fit">
                <div
                  className={`flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black shadow-lg sm:h-[35px] sm:w-[35px] md:h-[40px] md:w-[40px]`}
                >
                  <Icon icon="mingcute:user-4-fill" className="text-3xl text-white" />
                </div>
                {activeTypingUsers.includes(selectedUserChat?.respondent?.user_id?.toString()) && (
                  <div className="absolute bottom-0 right-1 z-20 h-2 w-2 rounded-full border border-white bg-[#34C759] shadow-f2 sm:h-2 sm:w-2" />
                )}
              </div>

              <div className="flex flex-col">
                {selectedUserChat?.respondent?.first_name ? (
                  <p className="text-sm font-semibold capitalize">
                    {selectedUserChat?.respondent?.first_name} {selectedUserChat?.respondent?.last_name}
                  </p>
                ) : (
                  <p className="text-sm font-semibold capitalize">{selectedUserChat.name || 'User'}</p>
                )}

                {(isLoadingSentMessage || isLoadingStartConversation) &&
                  selectedUserChat?.respondent?.user_id === selectedUserChat?.respondent?.user_id && (
                    <p className="text-xs italic text-gray-500">sending...</p>
                  )}

                {activeTypingUsers.includes(selectedUserChat?.respondent?.user_id?.toString()) && (
                  <div className="text-xs italic text-green-500">
                    <p>{'typing...'}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:hidden">
              <Icon
                icon="mdi:close-thick"
                className="cursor-pointer text-2xl text-[#6B7280]"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div
          style={{
            backgroundImage: "url('/assets/messages-frame.png')",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
          ref={scrollableBottomRef}
          className="relative h-[calc(100dvh-100px)] flex-1"
          id="scrollableDiv"
        >
          {chatMessageIsLoading || (chatMessageIsFetching && hideIsFetching) ? (
            <div
              style={{
                backgroundImage: "url('/assets/messages-frame.png')",
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }}
              className="inset-0 z-50 flex min-h-screen items-center justify-center lg:absolute lg:min-h-full"
            >
              <div className="animate-pulse text-center italic text-gray-700">Loading conversation...</div>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={combinedMessages.length}
              next={() => fetchMessages(selectedUserChat?.lastMessage?.chat_id)}
              hasMore={hasMoreMessages}
              loader={
                isLoadingMore && (
                  <div className="flex animate-pulse justify-center py-3 text-center italic text-gray-700">
                    Loading older messages...
                  </div>
                )
              }
              endMessage={
                combinedMessages.length > 0 && !hasMoreMessages ? (
                    <div className="flex items-center justify-center py-4">
                    <hr className="flex-grow border-t border-gray-200" />
                    <p className="mx-4 flex-shrink-0 text-xs text-gray-500">Beginning of conversation</p>
                    <hr className="flex-grow border-t border-gray-200" />
                    </div>
                ) : null
              }
              inverse={true}
              style={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: '-ms-autohiding-scrollbar'
              }}
              className="relative touch-pan-y p-4 [&>div]:flex [&>div]:flex-1 [&>div]:flex-col-reverse"
              scrollableTarget="scrollableDiv"
              scrollThreshold="200px"
              onScroll={handleScroll}
            >
              {/* Display a message when there are no messages yet */}
              {combinedMessages.length === 0 && !chatMessageIsLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <MessageChatList
                  isLoadingSentMessages={isLoadingSentMessage || isLoadingStartConversation}
                  selectedStores={selectedStores}
                  selectedUserChat={selectedUserChat}
                  activeTypingUsers={activeTypingUsers}
                  chatMessageDetailsData={chatMessageDetailsData}
                  chatMessageDetailsIsSuccess={chatMessageDetailsIsSuccess}
                  combinedMessages={combinedMessages}
                  chatMessageIsLoading={chatMessageIsLoading}
                  messagesContainerRef={messagesContainerRef}
                />
              )}
            </InfiniteScroll>
          )}
        </div>

        {/* Fixed Textarea at Bottom */}
        <div
          className={`sticky bottom-0 z-10 flex-shrink-0 border-t border-gray-200 bg-white px-3 py-2 ${chatMessageIsLoading || (chatMessageIsFetching && hideIsFetching) ? 'opacity-50' : ''}`}
        >
          <div className="flex w-full items-center justify-between">
            <TextAreaInput
              row={3}
              className={`${windowWidth < 1000 && formValues.message.length > 80 ? 'h-30' : 'h-10'} w-full rounded-none border-none text-lg focus:border-0 focus:ring-0 lg:text-base`}
              placeholder={`${isLoadingSentMessage || isLoadingStartConversation ? 'Sending...' : 'Type a message...'}`}
              onChange={handleInputChange}
              value={formValues.message}
              name="message"
              onKeyDown={e => {
                // Check if it's a desktop device (not mobile or tablet)
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

                if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
                  e.preventDefault()
                  if (formValues.message.length > 0) {
                    if (!selectedUserChat?.lastMessage?.chat_id) {
                      handleStartConversationMessage()
                    } else {
                      handleExchangeMessage()
                    }
                  }
                }
              }}
            />
            <button
              disabled={formValues.message.length === 0}
              className={`${formValues.message.length === 0 ? 'opacity-50' : ''}`}
            >
              <Icon
                onClick={() => {
                  if (!selectedUserChat?.lastMessage?.chat_id) {
                    handleStartConversationMessage()
                  } else {
                    handleExchangeMessage()
                  }
                }}
                icon="radix-icons:paper-plane"
                className="relative z-30 cursor-pointer text-[25px] text-black hover:text-gray-500"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatComponent
