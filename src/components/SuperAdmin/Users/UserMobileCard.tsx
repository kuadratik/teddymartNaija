import CustomButton from '@/components/SharedUI/Buttons/Button'
import {handleShowAdminRole} from '@/pages/super-admin/dashboard/users'
import {IStaffManagementDatum} from '@/types/super-admin/user-management'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps} from 'antd'
import React from 'react'

interface IProps {
  data: IStaffManagementDatum
  items: MenuProps['items']
  setSelectedItem: React.Dispatch<React.SetStateAction<IStaffManagementDatum | null>>
}
const UserMobileCard = ({data, items, setSelectedItem}: IProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white bg-[#F9F9F963] p-5 shadow-f1">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-[#222222]">{data?.first_name + ' ' + data?.last_name || 'User Name'}</h2>
        <div className="">
          <Dropdown menu={{items}} trigger={['click']}>
            <a
              onClick={e => {
                e.preventDefault()
                setSelectedItem(data)
              }}
            >
              <Icon icon="bi:three-dots" className="relative rotate-90 text-xl" />
            </a>
          </Dropdown>
        </div>
      </div>
      <p className="text-sm text-[#7C7C7C]">{data?.email || 'Email'}</p>
      <p className="text-sm text-[#7C7C7C]">
        Number of Permissions: {Array.isArray(data?.permissions) ? (data?.permissions as any[]).length : '-'}
      </p>
      <div className="mt-2">
        <CustomButton className="rounded-lg border border-[#F4F4F4] bg-[#F0F0F0] py-3 text-black">
          {data?.role ? handleShowAdminRole(data.role) : 'Super Admin'}
        </CustomButton>
      </div>
    </div>
  )
}

export default UserMobileCard
