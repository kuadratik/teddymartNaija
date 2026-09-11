import {Icon} from '@iconify/react'
import React from 'react'
import TextComponent from '../SharedUI/TextComponent'
import {useRouter} from 'next/router'
import {Badge, Button, Dropdown, Menu, Image} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {typeOptions} from '@/pages/vendor'
import {useGetAllClipsQuery} from '@/services/clips'

interface ITopBarProps {
  title: string
  backFunction?: VoidFunction
  showClip?: boolean
  service_types?: boolean
}
const TopBar = ({title, backFunction, showClip, service_types = false}: ITopBarProps) => {
  const router = useRouter()

  const dispatch = useDispatch()

  const {type} = useSelector((state: any) => state.vendor)

  if (type === 'service') {
    showClip = false
  }

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
  }

  const handleBack = () => {
    router.back()
  }

  const {data, isLoading, isFetching} = useGetAllClipsQuery({})

  return (
    <div className="fixed-header">
      <div className="flex w-full items-center">
        <Button
          className="!border-none bg-white !p-0 text-[14px] font-bold text-[#141414]"
          onClick={backFunction ?? handleBack}
        >
          <Icon icon="ep:back" className={`text-2xl`} />
        </Button>
        {service_types ? (
          <>
            {' '}
            <div className="flex w-full items-center justify-center px-6 py-3">
              <Dropdown
                overlay={
                  <Menu className="flex flex-col gap-1">
                    {typeOptions.map((option, index) => (
                      <p
                        key={option.value}
                        onClick={() => {
                          handleChange(option.value)
                        }}
                        className="cursor-pointer rounded-lg p-2 visited:text-[#27104E] hover:bg-[#F5F4F5]"
                      >
                        {option.label}
                      </p>
                    ))}
                  </Menu>
                }
                trigger={['click']}
              >
                <div className="flex h-[24px] flex-row items-center gap-2 font-inter text-sm font-medium text-[#33357D]">
                  <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[17px]">
                    {type}
                  </TextComponent>{' '}
                  <Image src="/assets/downArrow.svg" preview={false} className="font-medium" />
                </div>
              </Dropdown>
            </div>
          </>
        ) : (
          <div className="flex w-full flex-col items-center justify-center !p-0">
            {' '}
            <TextComponent as="h1" className="text-[16px] font-semibold leading-[32px] text-[#000000]">
              {title}
            </TextComponent>
          </div>
        )}

        {showClip && (
          <Button
            onClick={() => {
              router.push('/clips')
            }}
            type="text"
            className="flex-center"
            size="large"
            icon={
              <Badge count={data?.data?.total_product_count} color="#000000">
                <Icon icon={'mdi-light:cart'} className="text-[28px]" />
              </Badge>
            }
          />
        )}
      </div>
    </div>
  )
}

export default TopBar
