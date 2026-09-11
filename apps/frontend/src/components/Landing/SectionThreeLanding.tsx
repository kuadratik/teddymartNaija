import Image from 'next/image'
import {useRouter} from 'next/router'
import CustomButton from '../SharedUI/Buttons/Button'
const landingAdvantages = [
  {
    id: 1,
    title: 'Extensive Customer Base',
    description:
      'myEKI connects vendors with a large and diverse customer base locally and globally. Vendors can expand their reach, tap into new markets, and connect with customers seeking quality African products and services.',
    bg: '#AF52DE'
  },
  {
    id: 2,
    title: 'Authentic African Products',
    description:
      'myEKI celebrates and promotes genuine African products. Vendors offering authentic foods, ingredients, and cultural items can showcase their unique offerings to a dedicated audience that values African authenticity.',
    bg: '#32ADE6'
  },
  {
    id: 3,
    title: 'Enhanced Visibility & Brand Exposure',
    description:
      'By listing products on myEKI, vendors gain access to increased brand visibility. Our platform draws in customers specifically looking for African goods and services, providing vendors with targeted marketing opportunities that boost brand recognition.',
    bg: '#34C759'
  },

  {
    id: 4,
    title: 'Streamlined Order Management',
    description:
      'Vendors can manage orders with ease using myEKI’s streamlined processes. From tracking shipments to ensuring timely fulfillment, our platform simplifies order management for vendors.',
    bg: '#FF9500'
  },
  {
    id: 5,
    title: 'Collaborative Vendor Community',
    description:
      'myEKI fosters a vibrant, collaborative community where vendors can connect, network, and learn from each other. This supportive environment encourages growth, shared success, and opportunities for collaboration.',
    bg: '#FF2D55'
  },
  {
    id: 6,
    title: 'Seller Tools and Support',
    description:
      'myEKI equips vendors with comprehensive tools and support, including product management features, marketing assistance, and expert guidance. Our goal is to provide vendors with the resources needed to thrive and expand their business.',
    bg: '#00C7BE'
  }
]
interface IProps {
  isStartSelling: string
}
const SectionThreeLanding = ({isStartSelling}: IProps) => {
  const router = useRouter()
  return (
    <div className="4xl:max-w-7xl mx-auto h-full lg:my-8 lg:px-8 xl2:px-0">
      <div className="relative flex flex-col gap-3 lg:flex-row">
        <div className="lg:w-[55%] w-full">
          <Image
            src={'/assets/landing/holding-phone-landing.png'}
            alt="myEKI"
            width={300}
            height={300}
            className="w-full lg:aspect-square lg:object-contain"
          />
        </div>

        <div className="relative lg:right-24 lg:w-[50%] lg:pl-[20px] lg:pr-[120px] 3xl:right-0">
          <p className="w-fit rounded-[9px] bg-[#4d4d4d2d] px-3 py-1.5 text-center text-sm font-[500]">
            A Dynamic Marketplace
          </p>
          <h2 className="text-[30px] font-bold leading-[56px] lg:text-[40px]">
            <span className="text-[#000]">
              Unique advantages and tools for <span className="inline-block text-[#6B7280]">Growth. Every vendor.</span>
            </span>
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 md:gap-10">
            {landingAdvantages.map(feature => (
              <div className="items- flex flex-col p-2" key={feature.id}>
                <div
                  style={{
                    backgroundColor: feature.bg
                  }}
                  className="flex h-[48px] w-[48px] items-center justify-center rounded-[8px]"
                />
                <div className="flex flex-col gap-2">
                  <h4 className="pb-2 pt-5 text-[20px] font-semibold capitalize">{feature.title}</h4>
                  <p className="text-sm text-[#404040]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CustomButton
              className="flex items-center justify-center gap-2 rounded-[5px] bg-black px-5 py-3.5 text-center font-semibold text-white hover:opacity-80"
              onClick={() => router.push(isStartSelling)}
              type="button"
            >
              Sell on myEKI
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionThreeLanding
