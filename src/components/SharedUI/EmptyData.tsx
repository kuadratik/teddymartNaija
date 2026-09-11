import Image from 'next/image'

interface IProps {
  title: string
  btnTitle: string
}
function EmptyData({btnTitle, title}: IProps) {
  return (
    <div className="mt-4 rounded-md bg-[#F9F9F9] p-5 text-center">
      <p className="text-xs">{title}</p>
      <div className="my-2 flex items-center justify-center">
        <Image src={'/assets/no-results.svg'} alt="noresuts" width={122} height={99} />
      </div>
      <p className="bg-darkColor mx-auto w-fit rounded-[3px] px-5 py-2 text-[10px] text-white">{btnTitle}</p>
    </div>
  )
}

export default EmptyData
