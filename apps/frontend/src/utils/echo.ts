import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Echo: Echo<any>
    Pusher: any
  }
}

const initializeEcho = (authToken?: string) => {
  if (typeof window !== 'undefined') {
    window.Pusher = Pusher

    const options = {
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],

      authorizer: (channel: any) => {
        console.log('🚀 ~ initializeEcho ~ channel:', channel)
        return {
          authorize: async (socketId: string, callback: Function) => {
            try {
              const response = await fetch(`${process.env.baseUrl}broadcasting/auth`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authToken ? `Bearer ${authToken}` : '',
                  Accept: 'application/json'
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name
                })
              })

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
              }

              const data = await response.json()
              console.log('Authorization success:', data)
              callback(false, data)
            } catch (error) {
              console.log('Authorization error:', error)
              callback(true, error)
            }
          }
        }
      }
    }

    window.Echo = new Echo(options as any)

    // Add connection error handling
    window.Echo.connector.pusher.connection.bind('error', (error: any) => {
      console.error('Connection error:', error)
    })

    // Add connection success handling
    window.Echo.connector.pusher.connection.bind('connected', () => {
      console.log('Successfully connected to Reverb')
    })

    return window.Echo
  }
}

export default initializeEcho
