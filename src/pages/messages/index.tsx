import CustomerLayout from '@/components/Layout/Customerlayout'
import ChatComponent, {getInitials} from '@/components/Messages/ChatComponent'
import SEOHead from '@/components/SharedUI/SEOHead'
import {AppState} from '@/redux/store'
import {
  useChatMessagesQuery,
  useCreateStartConversationMutation,
  useGetChatDetailsQuery,
  useSendMessagesMutation,
  useUpdateReadReceiptMutation,
  useUserConversationsQuery
} from '@/services/messaging'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'

import SideChatList from '@/components/Messages/SideChatList'
import SkeletonLoaderForList from '@/components/SharedUI/Loader/SkeletonLoaderForList'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppSelector} from '@/hooks/reduxHooks'
import useWindowResize from '@/hooks/useWindowResize'
import {setMobileChatMessageModal} from '@/redux/features/messagingSlice'
import {Modal} from 'antd'
import updateLocale from 'dayjs/plugin/updateLocale'
import Link from 'next/link'
import {parseCookies} from 'nookies'
import {useDispatch} from 'react-redux'
import { useActiveUserQuery } from '@/services/general/general'

// Extend dayjs with both plugins
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

const Messaging = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const allCookies = parseCookies()
  const [search, setSearch] = useState('')
  const cookiesToken = allCookies['token']
  const [selectedUserChat, setSelectedUserChat] = useState<any | null>(null)
  console.log('🚀 ~ Messaging ~ selectedUserChat:', selectedUserChat)
  const selectedStores = useSelector((state: AppState) => state.messaging.selectedStores)
  const {
    isLoading,
    data,
    refetch: refetchConversations
  } = useUserConversationsQuery({
    name: search
  })
  const {width: windowWidth} = useWindowResize()

  const router = useRouter()
  const {userId} = router.query // Get the store ID from URL query
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const [formValues, setFormValues] = useState({
    message: ''
  })
  const [messages, setMessages] = useState<any[]>([])
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isNearTop, setIsNearTop] = useState(false)
  const [combinedMessages, setCombinedMessages] = useState<any[]>([])
  const dispatch = useDispatch()
  const isOpen = useSelector((state: any) => state.messaging.isOpenMobileModal)
  const {data: activeUserData, isSuccess, isLoading: activeUserIsLoading} = useActiveUserQuery()
  const ReceivedMessage = useSelector((state: any) => state?.chat?.messages)
  const scrollableBottomRef = useRef<HTMLDivElement>(null)
  const {
    data: chatMessageData,
    isSuccess: chatMessageIsSuccess,
    isLoading: chatMessageIsLoading,
    isFetching: chatMessageIsFetching,
    refetch
  } = useChatMessagesQuery({
    chat_id: selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id
  })
  const {
    data: chatMessageDetailsData,
    isSuccess: chatMessageDetailsIsSuccess,
    isLoading: chatMessageDetailsIsLoading
  } = useGetChatDetailsQuery({
    uid: selectedUserChat?.uuid
  })
  const typingUsers = useSelector((state: any) => state.chat.typingUsers)
  const activeTypingUsers = Object.keys(typingUsers).filter(userId => typingUsers[userId] === true)
  const [createStartConversation, {isLoading: isLoadingStartConversation, error}] = useCreateStartConversationMutation()
  const [updateReadReceipt] = useUpdateReadReceiptMutation()
  const [sendMessages, {isLoading: isLoadingSentMessage, error: sendMessageError}] = useSendMessagesMutation()
  const [hideIsFetching, setHideIsFetching] = useState(true)
  const userInitials = selectedUserChat?.respondent
    ? getInitials(selectedUserChat?.respondent?.last_name, selectedUserChat?.respondent?.first_name)
    : 'U'
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  // Function to emit typing status
  const emitTypingStatus = (isTyping: boolean) => {
    if (!window.Echo || !activeUserData?.data?.id) {
      // console.log('Echo or user ID not available', {echo: window.Echo, userId: activeUserData?.data?.id})
      return
    }

    // console.log('Emitting typing status:', isTyping)
    window.Echo.private(
      `App.Models.User.${selectedUserChat?.respondent?.user_id || selectedUserChat?.respondent?.id}`
    ).whisper('typing', {
      // Changed from 'typing' to 'client-typing'
      user: activeUserData.data.id,
      typing: isTyping
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target

    // Update form values
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))

    // Emit typing status when there's input
    emitTypingStatus(value.length > 0)
  }
  const scrollToBottom = () => {
    if (scrollableBottomRef.current) {
      const scrollElement = scrollableBottomRef.current
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }
  // // Add this useEffect to handle the typing indicator timeout
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        (selectedUserChat?.respondent?.user_id && formValues.message.length > 0) ||
        (selectedUserChat?.respondent?.id && formValues.message.length > 0)
      ) {
        emitTypingStatus(false)
      }
    }, 3000) // Stop showing typing indicator after 3 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [formValues]) // Depend on formValues to reset timer when user types

  // Create a combined messages state

  // Add this scroll handler function
  const handleScroll = (e: any) => {
    const scrollTop = Math.abs(e.target.scrollTop) // Convert negative to positive
    const scrollHeight = e.target.scrollHeight
    const clientHeight = e.target.clientHeight

    // Show message when scrollTop is large (meaning we're near the top)
    setIsNearTop(scrollTop > scrollHeight - clientHeight - 100) // Adjust 100 as needed
  }
  const handleTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.scrollTop === 0) {
      target.scrollTop = 1
    } else if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      target.scrollTop -= 1
    }
  }
  useEffect(() => {
    if (!isAuthenticatedToken) {
      // Check if the user is logged in
      router.push('/')
    }
  }, [isAuthenticatedToken])
  // Add the touch handler to your scrollableDiv
  useEffect(() => {
    const scrollable = document.getElementById('scrollableDiv')
    if (scrollable) {
      scrollable.addEventListener('touchstart', handleTouchStart)
      return () => {
        scrollable.removeEventListener('touchstart', handleTouchStart)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedStores.length > 0 && userId) {
      // Find the store that matches the ID from the URL
      const storeToOpen = selectedStores.find(store => store?.user_id?.toString() === userId.toString())
      if (storeToOpen) {
        setSelectedUserChat(storeToOpen)
      }
    }
  }, [selectedStores, userId])
  useEffect(() => {
    // Update selected chat when data changes
    if (data?.data?.data && selectedUserChat) {
      const updatedChat = data.data.data.find(chat => chat.user_id === selectedUserChat.user_id)
      if (updatedChat) {
        setSelectedUserChat(updatedChat)
      }
    }
  }, [data?.data?.data])

  // First useEffect for immediate WebSocket messages

  useEffect(() => {
    if (
      ReceivedMessage &&
      ReceivedMessage.length > 0 &&
      (selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id)
    ) {
      const wsMessage = ReceivedMessage[ReceivedMessage.length - 1]
      console.log('🚀 ~ useEffect ~ wsMessage:', wsMessage)

      // Only process messages for the selected chat
      if (wsMessage.chat_id !== (selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id)) {
        return
      }

      setCombinedMessages(prev => {
        const newMessage = {
          id: `ws-${Date.now()}`,
          text: wsMessage.message,
          isSender: wsMessage.sender === activeUserData?.data?.id,
          timestamp: dayjs(wsMessage.timestamp).toDate(),
          user_id: wsMessage.sender,
          chat_id: wsMessage.chat_id, // Make sure chat_id is included
          isWebSocket: true
        }

        // Check for duplicates within a 5-second window
        const isDuplicate = prev.some(
          existingMsg =>
            existingMsg.text === newMessage.text &&
            existingMsg.user_id === newMessage.user_id &&
            existingMsg.chat_id === newMessage.chat_id &&
            Math.abs(dayjs(existingMsg.timestamp).diff(dayjs(newMessage.timestamp), 'second')) < 5
        )

        if (isDuplicate) {
          return prev
        }

        return [...prev, newMessage].sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf())
      })
    }
  }, [ReceivedMessage, selectedUserChat?.lastMessage?.chat_id, selectedUserChat?.chat_id])

  // Second useEffect for API messages
  useEffect(() => {
    if (
      chatMessageIsSuccess &&
      chatMessageData &&
      (selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id)
    ) {
      const apiMessages = chatMessageData?.data?.data
        .filter(msg => msg.chat_id === (selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id)) // Filter messages by selected chat
        .map(msg => ({
          id: msg.id,
          text: msg.content,
          isSender: msg.user_id === activeUserData?.data?.id,
          timestamp: dayjs(msg.created_at).toDate(),
          user_id: msg.user_id,
          chat_id: msg.chat_id,
          isWebSocket: false
        }))

      setCombinedMessages(prev => {
        const latestApiTimestamp =
          apiMessages.length > 0 ? Math.max(...apiMessages.map(msg => dayjs(msg.timestamp).valueOf())) : 0

        const recentWsMessages = prev.filter(
          msg =>
            msg.isWebSocket &&
            msg.chat_id === (selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id) && // Filter WebSocket messages by selected chat
            dayjs(msg.timestamp).valueOf() > latestApiTimestamp &&
            !apiMessages.some(
              apiMsg =>
                apiMsg.text === msg.text &&
                apiMsg.user_id === msg.user_id &&
                apiMsg.chat_id === msg.chat_id &&
                Math.abs(dayjs(apiMsg.timestamp).diff(dayjs(msg.timestamp), 'second')) < 5
            )
        )

        return [...apiMessages, ...recentWsMessages].sort(
          (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
        )
      })

      setNextCursor(chatMessageData.data.next_cursor)
      setPrevCursor(chatMessageData.data.prev_cursor)
    }
  }, [chatMessageData, chatMessageIsSuccess, selectedUserChat?.lastMessage?.chat_id])

  // useEffect than fires  immediately when the handleReadReceipt() func is called
  useEffect(() => {
    if (selectedUserChat?.unread > 0) {
      handleReadReceipt()
    }
  }, [selectedUserChat?.unread])
  useEffect(() => {
    if (selectedUserChat?.slug) {
      setCombinedMessages([])
    }
  }, [userId, selectedUserChat?.slug])
  // Function to send a message
  const handleSendMessage = (recipientId: string, message: string) => {
    if (!window.Echo) return
    // Emit the message
    window.Echo.private(`App.Models.User.${recipientId}`).whisper('GotMessage', {
      message: message,
      sender: false,
      timestamp: new Date().toISOString(),
      chat_id: selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id
    })
  }
  const handleReadReceipt = async () => {
    setHideIsFetching(false)
    let payload = {}
    try {
      await updateReadReceipt({body: payload, chat_id: selectedUserChat?.lastMessage?.chat_id}).unwrap()
    } catch (error) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Oops something went wrong</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }
  const handleStartConversationMessage = async () => {
    setHideIsFetching(false)
    const messageText = formValues.message
    const timestamp = new Date().toISOString()
    // Clear the input field immediately
    setFormValues({message: ''})
    // Prepare message data
    const newMessage = {
      id: Date.now().toString(), // temporary ID
      text: messageText,
      isSender: true,
      timestamp: timestamp,
      user_id: activeUserData?.data?.id,
      chat_id: selectedUserChat?.lastMessage?.chat_id,
      isWebSocket: true // mark as websocket message until API confirms
    }
    // Add to combined messages
    // setCombinedMessages(prev => [...prev, newMessage])
    emitTypingStatus(false)
    scrollToBottom()

    // Show message in UI immediately
    let payload = {
      user_id: selectedUserChat?.user_id,
      message: formValues.message,
      advert_id: '',
      listing_id: ''
    }
    try {
      const response = await createStartConversation({body: payload, convoRoute: 'listing'}).unwrap()
      setFormValues({message: ''})
      setSelectedUserChat(response?.data)
      handleSendMessage(selectedUserChat?.respondent?.id, messageText)
      refetch()
    } catch (error) {
      setCombinedMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? {...msg, failed: true} // Add failed flag
            : msg
        )
      )
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Error starting a conversation</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  const handleExchangeMessage = async () => {
    setHideIsFetching(false)
    const messageText = formValues.message
    const timestamp = new Date().toISOString()
    // Clear the input field immediately
    setFormValues({message: ''})
    // Prepare message data
    const newMessage = {
      id: Date.now().toString(), // temporary ID
      text: messageText,
      isSender: true,
      timestamp: timestamp,
      user_id: activeUserData?.data?.id,
      chat_id: selectedUserChat?.lastMessage?.chat_id,
      isWebSocket: true // mark as websocket message until API confirms
    }
    // // Add to combined messages
    // setCombinedMessages(prev => [...prev, newMessage])
    emitTypingStatus(false)
    // Show message in UI immediately
    handleSendMessage(selectedUserChat?.respondent?.user_id, messageText)
    scrollToBottom()
    // Scroll to bottom to show new message

    const payload = {
      chat_id: selectedUserChat?.lastMessage?.chat_id,
      message: messageText
    }

    try {
      await sendMessages({body: payload}).unwrap()
      setFormValues({message: ''})
      refetch()
    } catch (error) {
      setCombinedMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? {...msg, failed: true} // Add failed flag
            : msg
        )
      )
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Please check your network connection</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }
  const fetchMessages = async (chatId?: string) => {
    // Use the passed chatId or fall back to the selected chat's ID
    const currentChatId = chatId || selectedUserChat?.lastMessage?.chat_id || selectedUserChat?.chat_id
    if (!currentChatId || !hasMoreMessages || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      console.log(`Fetching messages with cursor: ${nextCursor || 'Initial load'} for chat: ${currentChatId}`)

      const response = await fetch(`${process.env.baseUrl}chats/${currentChatId}/messages?cursor=${nextCursor || ''}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookiesToken}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('API response for fetchMessages:', data)

      if (data.success) {
        // Guard against no data
        if (!data.data || !data.data.data || data.data.data.length === 0) {
          console.log('No messages returned from API')
          setHasMoreMessages(false)
          setIsLoadingMore(false)
          return
        }

        setCombinedMessages(prevMessages => {
          // Convert new messages from API to our format
          const newMessages = data.data.data.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            isSender: msg.user_id === activeUserData?.data?.id,
            timestamp: new Date(msg.created_at),
            user_id: msg.user_id,
            chat_id: msg.chat_id
          }))

          console.log(`Loaded ${newMessages.length} new messages`)

          // Create a map for efficient duplicate checking
          const messageMap = new Map()

          // Add new messages first to prioritize them
          newMessages.forEach((msg: any) => {
            messageMap.set(msg.id, msg)
          })

          // Then add previous messages, avoiding duplicates
          prevMessages.forEach(msg => {
            if (!messageMap.has(msg.id)) {
              messageMap.set(msg.id, msg)
            }
          })

          // Convert map back to array and sort by timestamp (newest first for inverse scrolling)
          return Array.from(messageMap.values()).sort(
            (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
          )
        })

        // Update pagination state
        setNextCursor(data.data.next_cursor)
        setHasMoreMessages(!!data.data.next_cursor)
        console.log('Updated next_cursor:', data.data.next_cursor)
        console.log('Updated hasMoreMessages:', !!data.data.next_cursor)
      } else {
        console.error('API returned success: false', data)
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Error loading messages</>}
                textColor="#FFF"
                message=""
                backgroundColor="#000"
              />
            )
          },
          message: 'message'
        })
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setHasMoreMessages(false)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Add this effect to reset state when changing chats
  useEffect(() => {
    if (selectedUserChat?.lastMessage?.chat_id) {
      // Reset states for new chat
      // setNextCursor(null)
      setHasMoreMessages(true)
      // Fetch initial messages for the new chat
      fetchMessages(selectedUserChat.lastMessage.chat_id)
    }
  }, [selectedUserChat?.lastMessage?.chat_id])

  return (
    <>
      <SEOHead
        title={`myEKI | Messages`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <div className="mt-5 flex w-full flex-col items-center justify-center lg:mt-0 lg:min-h-[80vh]">
        {' '}
        {/* Added min-h-screen and justify-center */}
        <div className="flex w-full max-w-7xl gap-8 px-[5px] lg:mx-auto lg:px-[40px] xl:px-[0px]">
          {' '}
          {/* Removed top-20, mb-[76px], mt-[36px] */}
          <div className="min-h-[620px] pb-5 lg:pb-0 w-full rounded-lg border shadow-f1 lg:min-h-[520px] lg:w-[350px] lg:border-[#E5E5EA] lg:bg-white">
            <h3 className="border-b p-3 text-[22px] font-bold lg:block">Messages</h3>
            {isLoading ? (
              <div>
                <SkeletonLoaderForList length={5} />
              </div>
            ) : (
              <>
                {' '}
                <SideChatList
                  data={data}
                  refetch={refetch}
                  refetchConversations={refetchConversations}
                  handleReadReceipt={handleReadReceipt}
                  scrollToBottom={scrollToBottom}
                  setHideIsFetching={setHideIsFetching}
                  setCombinedMessages={setCombinedMessages}
                  activeTypingUsers={activeTypingUsers}
                  selectedStores={selectedStores}
                  search={search}
                  setSearch={setSearch}
                  isLoadingStartConversation={isLoadingStartConversation}
                  isLoadingSentMessage={isLoadingSentMessage}
                  dispatch={dispatch}
                  isLoading={isLoading}
                  selectedUserChat={selectedUserChat}
                  setSelectedUserChat={setSelectedUserChat}
                  receivedMessage={ReceivedMessage}
                />
              </>
            )}
          </div>
          <div className="relative hidden h-[527px] w-full overflow-y-scroll rounded-lg bg-white shadow-f1 lg:block">
            {selectedUserChat && windowWidth > 1000 ? (
              <ChatComponent
                hideIsFetching={hideIsFetching}
                scrollToBottom={scrollToBottom}
                scrollableBottomRef={scrollableBottomRef}
                activeUserData={activeUserData}
                chatMessageIsFetching={chatMessageIsFetching}
                isLoadingStartConversation={isLoadingStartConversation}
                isLoadingSentMessage={isLoadingSentMessage}
                selectedStores={selectedStores}
                activeTypingUsers={activeTypingUsers}
                chatMessageDetailsData={chatMessageDetailsData}
                chatMessageDetailsIsSuccess={chatMessageDetailsIsSuccess}
                chatMessageIsLoading={chatMessageIsLoading}
                combinedMessages={combinedMessages}
                fetchMessages={fetchMessages}
                formValues={formValues}
                handleExchangeMessage={handleExchangeMessage}
                handleInputChange={handleInputChange}
                handleScroll={handleScroll}
                handleStartConversationMessage={handleStartConversationMessage}
                hasMoreMessages={hasMoreMessages}
                isLoadingMore={isLoadingMore}
                isNearTop={isNearTop}
                messagesContainerRef={messagesContainerRef}
                setSelectedUserChat={setSelectedUserChat}
                userInitials={userInitials}
                setIsModalOpen={setMobileChatMessageModal}
                selectedUserChat={selectedUserChat}
              />
            ) : (
              <div
                style={{
                  backgroundImage: "url('/assets/messages-frame.png')",
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'
                }}
                className="relative flex h-full w-full items-center justify-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <Image src={'/assets/chat-icon.svg'} width={100} height={100} className="mb-2" alt="Empty chat" />
                  {(data as any)?.data?.length > 0 ? (
                    <h3 className="text-center font-[500] text-[#6B7280]">Select a chat to view conversation</h3>
                  ) : (
                    <Link
                      href={'/find-vendor'}
                      className="text-center font-bold text-[#6B7280] hover:text-[#6B7280] hover:opacity-80"
                    >
                      Please <span className="font-bold text-blue-500 underline">click here</span> to find a vendor and
                      start a conversation.{' '}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedUserChat && windowWidth < 1000 && (
        <Modal
          width={'100vw'}
          height={'100vh'}
          style={{
            margin: 0,
            padding: 0,
            borderRadius: 0,
            maxWidth: '100vw',
            minHeight: '100dvh',
            WebkitOverflowScrolling: 'touch'
          }}
          closeIcon={false}
          styles={{
            content: {
              margin: 0,
              padding: 0
            },
            body: {
              height: '100vh',
              maxHeight: 'calc(100dvh - 0px)', // Adjust the value as needed
              overflow: 'auto'
            }
          }}
          className="fixed inset-0 left-0 top-0 z-50 m-0 bg-white p-0 lg:hidden"
          title=""
          open={isOpen}
          onCancel={() => dispatch(setMobileChatMessageModal(false))}
          centered
          footer={null}
        >
          <ChatComponent
            scrollToBottom={scrollToBottom}
            hideIsFetching={hideIsFetching}
            scrollableBottomRef={scrollableBottomRef}
            chatMessageIsFetching={chatMessageIsFetching}
            activeUserData={activeUserData}
            isLoadingStartConversation={isLoadingStartConversation}
            isLoadingSentMessage={isLoadingSentMessage}
            selectedStores={selectedStores}
            activeTypingUsers={activeTypingUsers}
            setIsModalOpen={() => dispatch(setMobileChatMessageModal(false))}
            chatMessageDetailsData={chatMessageDetailsData}
            chatMessageDetailsIsSuccess={chatMessageDetailsIsSuccess}
            chatMessageIsLoading={chatMessageIsLoading}
            combinedMessages={combinedMessages}
            fetchMessages={fetchMessages}
            formValues={formValues}
            handleExchangeMessage={handleExchangeMessage}
            handleInputChange={handleInputChange}
            handleScroll={handleScroll}
            handleStartConversationMessage={handleStartConversationMessage}
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
            isNearTop={isNearTop}
            messagesContainerRef={messagesContainerRef}
            setSelectedUserChat={setSelectedUserChat}
            userInitials={userInitials}
            selectedUserChat={selectedUserChat}
          />
        </Modal>
      )}
    </>
  )
}
Messaging.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default Messaging
