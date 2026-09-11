import Image from 'next/image'
import TextComponent from './TextComponent'

interface IProps {
  title: string
  btnTitle?: string | null
  btnAction?: any
  textNode?: React.ReactNode
}
function EmptyData({btnTitle, title, btnAction, textNode}: IProps) {
  return (
    <div className="mt-4 rounded-md px-5 text-center">
      <div className="my-1 flex items-center justify-center">
        <Image src={'/assets/EmptyState.svg'} alt="noresuts" width={250} height={200} />
      </div>
      {textNode ? (
        textNode
      ) : (
        <TextComponent as="p" className="text-xs">
          {title}
        </TextComponent>
      )}

      {btnTitle && (
        <button
          type="button"
          className="mx-auto mt-4 flex max-h-[36px] items-center justify-center rounded-[7px] bg-black px-4 py-[10px] text-white"
          onClick={() => {
            btnAction && btnAction()
          }}
        >
          <TextComponent as="span" className="text-xs font-medium text-white">
            {btnTitle}
          </TextComponent>
        </button>
      )}
    </div>
  )
}

export default EmptyData
