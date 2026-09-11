import Image from 'next/image'
import {useEffect, useState} from 'react'

const HeadwayWidget = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isShowWidget, setIsShowWidget] = useState(false)
  const [unseen, setUnseen] = useState(null)
  console.log("🚀 ~ HeadwayWidget ~ unseen:", unseen)

  useEffect(() => {
    const headwayAccountId = process.env.NEXT_PUBLIC_HEADWAY_ACCOUNT_ID

    if (!headwayAccountId) {
      console.error('Headway Account ID is not defined')
      return
    }

    // Add required styles
    const style = document.createElement('style')
    style.textContent = `
    .HW_badge {
        background: #ff3b30 !important;
        width: 12px !important;
        height: 12px !important;
        top: -4px !important;
        left: -4px !important;
        display: none !important; /* Hide by default */
        font-size: 0 !important; /* Hide the number */
        color: transparent !important; /* Hide the number */
      }
      
      /* Show badge only when there are unseen entries */
      .has-unseen .HW_badge {
        display: block !important;
      }

      .custom-badge-wrapper {
        position: relative;
        cursor: pointer;
      }

      .HW_frame_cont {
         top:80px !important;
         right:0px !important
      }

      .HW_badge_cont {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
    `
    document.head.appendChild(style)

    if (window.Headway) {
      window.Headway.init({
        selector: '.custom-badge-wrapper',
        account: headwayAccountId,
        triggers: [
          {
            selector: '.custom-badge-wrapper, .headway-image',
            on: 'click'
          }
        ],
        translations: {
          title: 'Latest Changes',
          readMore: 'Read more',
          labels: {
            new: 'News',
            improvement: 'Updates',
            fix: 'Fixes'
          },
          footer: 'myEKI Changelogs'
        },
        position: 'bottom',
        enabled: true,
        callbacks: {
          onWidgetReady: widget => {
            setIsInitialized(true)
            const unseenCount = widget.getUnseenCount()
            setUnseen(unseenCount)

            // Add or remove the has-unseen class based on unseen count
            const badgeWrapper = document.querySelector('.custom-badge-wrapper')
            if (badgeWrapper) {
              if (unseenCount > 0) {
                badgeWrapper.classList.add('has-unseen')
              } else {
                badgeWrapper.classList.remove('has-unseen')
              }
            }

            console.log('unseen entries count: ' + unseenCount)
          },
          onShowWidget: function () {
            setIsShowWidget(true)
            const frameContainer = document.querySelector('.HW_frame_cont')
            if (frameContainer) {
              frameContainer.classList.add('HW_visible')
            }
          },
          onHideWidget: function () {
            setIsShowWidget(false)
            const frameContainer = document.querySelector('.HW_frame_cont')
            if (frameContainer) {
              frameContainer.classList.remove('HW_visible')
            }
          },
          onError: error => {
            console.error('Headway error:', error)
          }
        }
      })
    }

    return () => {
      style.remove()
    }
  }, [unseen])

  useEffect(() => {
    // Update frame container visibility when isShowWidget changes
    const frameContainer = document.querySelector('.HW_frame_cont')
    if (frameContainer) {
      if (isShowWidget) {
        frameContainer.classList.add('HW_visible')
      } else {
        frameContainer.classList.remove('HW_visible')
      }
    }
  }, [isShowWidget])

  const handleClick = () => {
    if (window.Headway && isInitialized) {
      setIsShowWidget(true) // This will trigger the widget to open via the onWidgetReady callback
    }
  }

  // Function to programmatically close the widget
  const closeWidget = () => {
    if (window.Headway && isInitialized) {
      window.Headway.hide()
      setIsShowWidget(false)
    }
  }

  return (
    <div
      className="custom-badge-wrapper relative bottom-0.5 z-40 flex h-[30px] w-[30px] items-center justify-center hover:opacity-80"
      onClick={handleClick}
    >
      <Image
        onClick={() => setIsShowWidget(!isShowWidget)}
        src="/assets/release-notes-svgrepo-com.svg"
        width={24}
        height={24}
        alt="change-log"
        className="headway-image relative right-2 cursor-pointer lg:right-0"
      />
    </div>
  )
}

export default HeadwayWidget
