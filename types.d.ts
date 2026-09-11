declare global {
  interface Window {
    Headway: {
      init: (config: {
        selector: string
        account: string
        triggers?: Array<{
          trigger: string
          position: string
        }>
        callbacks?: {
          onShowWidget?: () => void
          onHideWidget?: () => void
        }
        translations?: {
          title?: string
          readMore?: string
          noUpdates?: string
        }
        colors?: {
          widget?: string
          background?: string
        }
        position?: string
        badge?: boolean
      }) => void
    }
  }
}
