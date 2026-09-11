import {Icon} from '@iconify/react'

const landingFeatureList = [
  {
    id: 1,
    title: 'vendor hub',
    description:
      'Showcase your products and services to a diverse local and global audience. Expand your reach, boost visibility, and grow your business with AfricanDiasporaMart.',
    icon: 'ic:outline-hub',
    bg: '#EDEDED'
  },
  {
    id: 2,
    title: 'Delivery Network',
    description:
      'Local riders for city-wide deliveries and international shippers for secure global reach, ensuring fast and reliable service for vendors and customers alike.',
    icon: 'mage:delivery-truck',
    bg: '#FBFBFB'
  },
  {
    id: 3,
    title: 'Ads Space',
    description:
      'Post items or services effortlessly with AfricanDiasporaMart Ads—no storefront needed. Reach potential buyers directly through our flexible classified ad space.',
    icon: 'icons8:advertising',
    bg: '#EDEDED'
  },

  {
    id: 4,
    title: 'Business Listings',
    description:
      'Comprehensive listings for businesses of all sizes, helping them gain visibility and attract clients across various categories.',
    icon: 'material-symbols-light:business-center-outline',
    bg: '#FBFBFB'
  }
]
interface SectionTwoLandingProps {}
const SectionTwoLanding = ({}: SectionTwoLandingProps) => {
  return (
    <div>
      <h2 className="text-center text-[30px] font-bold leading-[56px] lg:text-[40px]">
        <span className="text-[#4D4D4D]">
          Your{' '}
          <span className="relative left-1 top-[5px] inline-block">
            <Icon icon="pepicons-pop:hash" className="text-[40px]" />
          </span>
          1 Largest
        </span>{' '}
        Ultimate Hub
      </h2>
      <h3 className="text-center text-[25px] font-semibold leading-[56px] text-[#4D4D4D] lg:text-[35px]">
        Connecting Africa’s Vendors Globally
      </h3>
      <p className="mx-auto mt-2 lg:w-[50%] pb-12 w-[90%] text-center text-[#404040]">
        A comprehensive, full-service marketplace designed to meet the diverse needs of both local and global users.
      </p>
      {/* cards */}
      <div className="grid md:grid-cols-2 md:gap-10 gap-5 lg:grid-cols-4">
        {landingFeatureList.map(feature => (
          <div
            style={{
              backgroundColor: feature.bg
            }}
            className=" flex flex-col items-center rounded-[40px] border-[1px] border-[#EDEDED] p-6 shadow-f1"
            key={feature.id}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#D9D9D9]">
              <Icon icon={feature.icon} className="text-[40px] text-[#000]" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h4 className="pb-2 pt-5 text-center text-[20px] font-semibold capitalize">{feature.title}</h4>
              <p className="text-center text-base text-[#404040]">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionTwoLanding
