import {useEffect} from 'react'

export default function WebSocketComponent() {
  const userId = 1 //test user id

  useEffect(() => {
    if (!window.Echo) {
      console.error('Echo is not initialized')
      return
    }

    try {
      const pusher = window.Echo.connector.pusher

      pusher.connection.bind('connected', () => {
        console.log('Connected to WebSocket')
      })

      pusher.connection.bind('disconnected', () => {
        console.log('Disconnected from WebSocket')
      })

      pusher.connection.bind('error', (error: any) => {
        console.error('WebSocket Error:', error)
      })

      const channel = window.Echo.private(`user.${userId}`)
        .listen('UserEvent', (e: any) => {
          console.log('Received user event:', e)
        })
        .error((error: any) => {
          console.error('Channel error:', error)
        })

      return () => {
        pusher.connection.unbind_all()
        window.Echo.leave(`private-user.${userId}`)
      }
    } catch (error) {
      console.error('Error setting up WebSocket:', error)
    }
  }, [])

  return <div>WebSocket Component</div>
}
