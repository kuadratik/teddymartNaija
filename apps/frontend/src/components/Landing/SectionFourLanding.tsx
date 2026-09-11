import Image from 'next/image'
import {useState} from 'react'
import ComingSoon from '../Auth/Products/components/ComingSoon'
import CustomButton from '../SharedUI/Buttons/Button'
import PlannerModal from '../SharedUI/ModalComponent'
const riderSecStats = [
  {
    title: 'Active Members',
    value: '500+'
  },
  {
    title: 'Deliveries so far',
    value: '3.3k'
  },
  {
    title: 'Cities Served',
    value: '15'
  }
]
const SectionFourLanding = () => {
  const [comingSoon, showComingSoon] = useState(false)

  return (
    <div className="flex h-fit flex-col items-center justify-between gap-6 lg:flex-row">
      <Image
        src={'/assets/landing/sec4-img1-landing.png'}
        alt="AfricanDiasporaMart"
        width={300}
        height={300}
        className="w-full lg:aspect-square lg:h-[663px] lg:w-[25%] lg:object-contain"
      />
      <div className="w-full lg:w-[60%]">
        <h2 className="text-[28px] font-bold leading-[56px] lg:text-[35px]">
          <span className="text-[#000]">Join the MEK Delivery Network</span>
        </h2>
        <p className="font-[500] leading-[24px] text-[#4D4D4D]">
          AfricanDiasporaMart’s Delivery Network combines the efficiency of local riders with the global reach of international
          shippers. Local riders ensure fast deliveries within cities, while international shippers connect vendors to
          customers worldwide.
        </p>
        <p className="pt-3 font-[500] leading-[24px] text-[#4D4D4D]">
          Are you a shipper looking to elevate your logistics business? AfricanDiasporaMart is your gateway to endless opportunities
          and efficiency in shipping and logistics.
        </p>
        <div className="mt-3">
          <CustomButton
            className="flex w-fit items-center justify-center gap-2 rounded-[15px] bg-black px-5 py-3.5 text-center font-semibold text-white hover:opacity-80"
            onClick={() => showComingSoon(!comingSoon)}
            type="button"
          >
            Register for FREE
          </CustomButton>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {riderSecStats.map(stat => (
            <div className="mt-3 items-center gap-5" key={stat.title}>
              <p className="text-[14px] font-[500] leading-[24px] text-[#4D4D4D]">{stat.title}</p>
              <p className="text-[18px] font-bold leading-[24px] text-[#4D4D4D]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
      <Image
        role="button"
        onClick={() => showComingSoon(!comingSoon)}
        src={'/assets/landing/sec4-img2-landing.png'}
        alt="AfricanDiasporaMart"
        width={300}
        height={300}
        className="w-full hover:opacity-60 lg:h-[663px] lg:w-[25%] lg:object-contain"
      />
      {comingSoon && (
        <PlannerModal
          modalOpen={comingSoon}
          setModalOpen={showComingSoon}
          onCloseModal={() => showComingSoon(false)}
          modalStyles={{
            content: {
              backgroundColor: 'black'
            }
          }}
        >
          <ComingSoon onClose={() => showComingSoon(false)} />
        </PlannerModal>
      )}
    </div>
  )
}

export default SectionFourLanding
