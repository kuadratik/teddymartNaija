import {Icon} from '@iconify/react'
import {Tooltip} from 'antd'
import React, {useState} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'

interface BusinessAvailabilityCardProps {
  service: any
  setShowFrameModal: (show: boolean) => void
  onEditService?: (service: any) => void
  onDuplicateService?: (service: any) => void
  onDeleteService?: (service: any) => void
}

const BusinessAvailabilityCard: React.FC<BusinessAvailabilityCardProps> = ({
  service,
  setShowFrameModal,
  onEditService,
  onDuplicateService,
  onDeleteService
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (service?.availability_type === 'frame') {
      if (onEditService) {
        onEditService(service)
      } else {
        setShowFrameModal(true)
      }
    } else {
      onEditService && onEditService(service)
    }
  }

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDuplicateService) {
      onDuplicateService(service)
    }
  }

  if (
    !service ||
    !service.id ||
    !service.service_name ||
    !service.service_name.trim() ||
    service.service_name === 'Unnamed Service'
  )
    return null

  return (
    <div
      className="relative flex items-center justify-between rounded-lg border bg-[#F9F9F9] p-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip title={service.service_name} placement="top" color="#000000" arrow={{pointAtCenter: true}}>
        <p className="text-sm font-[500]">
          {service.service_name.length > 10 ? service.service_name.slice(0, 10) + '...' : service.service_name}-
          <span className="text-gray-500">{service.availability_type}</span>
        </p>
      </Tooltip>

      {onDeleteService && (
        <div
          className="absolute -right-2 -top-3 cursor-pointer rounded-full bg-gray-200 p-1 transition-colors hover:opacity-50"
          onClick={e => {
            e.stopPropagation()
            onDeleteService(service)
          }}
          title="Delete service"
        >
          <Icon icon="mdi:delete-outline" className="text-[18px] text-red-500" />
        </div>
      )}

      <div className="">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex h-6 w-8 cursor-pointer items-center justify-center border-l border-r"
            onClick={handleDuplicateClick}
          >
            <Icon icon="ion:duplicate-outline" className="text-[18px]" />
          </div>
          <div className="">
            <CustomButton className="bg-black p-2 text-white" onClick={handleEditClick}>
              Edit Availability
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessAvailabilityCard
