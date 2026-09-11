import {ChatMessagesTopLevel, IMessageTopLevel} from '@/types/messaging'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Messaging']
})

export const MessagingEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    // businessListings: build.query<
    //   BusinessListingTopLevel,
    //   {
    //     from?: string
    //     to?: string
    //     page?: string
    //     search?: string
    //     industry?: number[]
    //   }
    // >({
    //   query: arg => {
    //     const {from, to, page, search, industry} = arg
    //     const params: {[key: string]: string} = {
    //       page: page?.toString() ?? '1',
    //       search: search!,
    //       industry: industry?.toString() ?? ''
    //     }
    //     if (from) params.from = from
    //     if (to) params.to = to

    //     return {
    //       url: `/front/messagings`,
    //       method: 'GET',
    //       params
    //     }
    //   },
    //   providesTags: ['Messaging']
    // }),
    chatMessages: build.query<ChatMessagesTopLevel, {chat_id: any}>({
      query: ({chat_id}) => ({
        url: `/chats/${chat_id}/messages`,
        method: 'GET'
      }),
      providesTags: ['Messaging']
    }),

    getChatDetails: build.query<any, {uid: any}>({
      query: ({uid}) => ({
        url: `/chats/${uid}/details`,
        method: 'GET'
      }),
      providesTags: ['Messaging']
    }),
    userConversations: build.query<IMessageTopLevel, {name?: string}>({
      query: ({name}) => ({
        url: `/chats`,
        method: 'GET',
        params: {
          ...(name && {name})
        }
      }),
      providesTags: ['Messaging']
    }),
    createStartConversation: build.mutation<any, {body: any; convoRoute?: any}>({
      query: ({body, convoRoute}) => ({
        url: `/chats/start-conversation?convoRoute=${convoRoute}`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['Messaging']
    }),
    updateReadReceipt: build.mutation<any, {chat_id: any; body: any}>({
      query: ({chat_id, body}) => ({
        url: `/chats/${chat_id}/read`,
        body: {...body},
        method: 'PUT'
      }),
      invalidatesTags: ['Messaging']
    }),
    sendMessages: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/chats/send-message`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['Messaging']
    })
  }),
  overrideExisting: true
})

export const {
  useCreateStartConversationMutation,  useChatMessagesQuery,
  useUpdateReadReceiptMutation,
  useUserConversationsQuery,
  useSendMessagesMutation,
  useGetChatDetailsQuery
} = MessagingEndpoint
