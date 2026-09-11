import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Button} from 'antd'
import {useState} from 'react'

const TeddyAdvertMobile = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  return (
    <div
      className="flex h-auto flex-col gap-[300px] rounded"
      style={{background: 'linear-gradient(135deg, #0a0e1a 0%, #1b2152 100%)'}}
    >
      <div className="flex w-full flex-col items-center p-8 text-white">
        <div className="h-[50px] w-[150px] overflow-hidden rounded-[4px] bg-[#33357D] px-8 py-4">
          <ImageComponent
            isLoadingImage={isLoadingImage}
            setIsLoadingImage={setIsLoadingImage}
            src={`/assets/teddyed-logo.png`}
            alt="teddy-ed"
            className={`px-8`}
            width={58}
            height={17}
          />
        </div>{' '}
        <TextComponent as="p" className="mt-4 text-center text-base font-normal leading-[40px] text-white">
          TeddyEd is an innovative and comprehensive school management system designed to streamline administrative and
          operational tasks within a school environment{' '}
        </TextComponent>
        <Button
          //   onClick={() => {
          //     showComingSoon(true)
          //   }}
          style={{
            backgroundColor: '#fff',
            color: 'black',
            border: 'none',
            // Force the styles to remain the same on hover
            transition: 'none' // Disable any transitions
          }}
          htmlType="button"
          className="mt-[8px] whitespace-nowrap rounded-lg bg-[#fff] px-7 py-[22px] font-bold text-gray-800"
        >
          Request Info
        </Button>
      </div>{' '}
      <div className="relative text-white">
        <img
          src="/assets/forth_svg.svg"
          alt="Image 1"
          className="absolute bottom-0 left-40 z-30 h-[250px] w-[400px] rounded-lg bg-transparent shadow-lg"
        />

        <img
          src="/assets/third_svg.svg"
          alt="Image 1"
          className="absolute bottom-0 left-36 z-30 h-[250px] w-[300px] rounded-lg bg-transparent shadow-lg"
        />

        <img
          src="/assets/second_svg.svg"
          alt="Image 1"
          className="absolute bottom-0 left-20 z-30 h-[200px] w-[400px] rounded-lg bg-transparent shadow-lg"
        />

        <img
          src="/assets/first_svg.svg"
          alt="Image 1"
          className="absolute bottom-0 left-8 z-30 h-[150px] w-[500px] rounded-lg bg-transparent shadow-lg"
        />
      </div>
    </div>
  )
}

export default TeddyAdvertMobile
