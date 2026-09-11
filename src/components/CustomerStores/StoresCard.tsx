import Image from 'next/image'
import CustomButton from '../SharedUI/Buttons/Button'
import { Icon } from '@iconify/react'
import Link from 'next/link'

interface IProps {
  item: any
}
const StoresCard = ({item}: IProps) => {
  return (
    <div className="rounded-[16px] border border-gray-100 bg-white p-2 shadow-f2">
      <div className="relative">
        <Image
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
          alt="Store Image"
          width={300}
          height={139}
          className="h-[138px] w-full rounded-[12px] object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
          alt="Verified Badge"
          width={100}
          height={100}
          className="absolute -bottom-7 left-1/2 h-[64px] w-[64px] -translate-x-1/2 rounded-full object-fill"
        />
      </div>
      <div className="text-center text-[#2A2A2A]">
        <h3 className="pt-10 text-base font-semibold">Store Name</h3>
        <p className="mx-auto mt-2 w-[90%] text-sm">
          Andy shoes are designed to keeping in mind durability as well as trends...
        </p>

        <div className="">
          <Link href={`/store/${item.id}`} className="mb-2 mt-4 flex items-center justify-between rounded-[9px] bg-[#F9F9F9] px-4 py-1.5 text-sm font-medium hover:opacity-50 transition-all">
            <p className="text-left text-sm font-medium text-[#2A2A2A]">Go to storefront</p>
            <p className="h-[38px] w-[36px] flex items-center justify-center rounded-lg border border-[#FEFEFE] bg-white text-left text-sm font-medium text-[#FEFEFE]">
              <Icon icon="lets-icons:send-duotone" width="20" height="20" className="text-black" />
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StoresCard
