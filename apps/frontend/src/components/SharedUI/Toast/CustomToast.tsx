import Image from 'next/image'

interface IProps {
  title: any
  message?: string | any
  image?: any
  backgroundColor: string
  textColor: string
  altText: string
}

const CustomToast = ({title, message, image, backgroundColor, textColor, altText}: IProps) => {
  return (
    <div className="flex items-center justify-center" style={{backgroundColor: backgroundColor}}>
      <div className="text-center text-[14px] leading-5" style={{color: textColor}}>
        {title}
      </div>
    </div>
  )
}

export default CustomToast
