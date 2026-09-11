import Image from 'next/image'

interface IProps {
  title: any
  message?: string | any
  image: any
  backgroundColor: string
  textColor: string
  altText: string
}

const CustomToast = ({title, message, image, backgroundColor, textColor, altText}: IProps) => {
  return (
    <div className="flex items-center gap-x-4" style={{backgroundColor: backgroundColor}}>
      <Image src={image} alt={altText} width={40} height={40} />
      <div className="">
        <div className="text-[14px]" style={{color: textColor}}>
          {title}
        </div>
        {message !== '' ? <p className="pt-2 text-[12px] text-[#484C56]">{message}</p> : null}
      </div>
    </div>
  )
}

export default CustomToast
