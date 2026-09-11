import {Icon} from '@iconify/react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share'

interface SocialShareMenuProps {
  url: string
  title: string
  description?: string
}

const SocialShareMenu: React.FC<SocialShareMenuProps> = ({url, title, description}) => {
  // Function to handle TikTok sharing
  const handleTikTokShare = () => {
    window.open(`https://www.tiktok.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <FacebookShareButton url={url}>
        <div className="flex items-center gap-1 rounded bg-[#3b5998] px-3 py-2 text-white hover:opacity-80">
          <Icon icon="ri:facebook-fill" />
          <span>Share</span>
        </div>
        <p className="text-sm text-white">{title}</p>
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <div className="flex items-center gap-1 rounded bg-[#1da1f2] px-3 py-2 text-white hover:opacity-80">
          <Icon icon="ri:twitter-fill" />
          <span>Tweet</span>
        </div>
      </TwitterShareButton>

      <LinkedinShareButton url={url} title={title} summary={description}>
        <div className="flex items-center gap-1 rounded bg-[#0077b5] px-3 py-2 text-white hover:opacity-80">
          <Icon icon="ri:linkedin-fill" />
          <span>Share</span>
        </div>
      </LinkedinShareButton>

      <WhatsappShareButton url={url} title={title}>
        <div className="flex items-center gap-1 rounded bg-[#25D366] px-3 py-2 text-white hover:opacity-80">
          <Icon icon="ri:whatsapp-fill" />
          <span>Share</span>
        </div>
      </WhatsappShareButton>

      <TelegramShareButton url={url} title={title}>
        <div className="flex items-center gap-1 rounded bg-[#0088cc] px-3 py-2 text-white hover:opacity-80">
          <Icon icon="ri:telegram-fill" />
          <span>Share</span>
        </div>
      </TelegramShareButton>

      <button
        onClick={handleTikTokShare}
        className="flex items-center gap-1 rounded bg-[#000000] px-3 py-2 text-white hover:opacity-80"
      >
        <Icon icon="ri:tiktok-fill" />
        <span>Share</span>
      </button>

      {/* Copy to clipboard button */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(url)
          // You might want to add a toast notification here
        }}
        className="flex items-center gap-1 rounded bg-[#666666] px-3 py-2 text-white hover:opacity-80"
      >
        <Icon icon="ri:clipboard-fill" />
        <span>Copy Link</span>
      </button>
    </div>
  )
}

export default SocialShareMenu
