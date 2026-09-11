import {Button, ButtonProps, Result} from 'antd'
import React from 'react'

interface IEmptyResult extends ButtonProps {
  text?: string
  title?: string
  showBtn?: boolean
  onClick?: () => void
}

const EmptyResult = (props: IEmptyResult) => {
  const {title, text, showBtn = true} = props
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Result
        className="flex flex-col items-center justify-center"
        icon={<img src="/assets/new-empty-state.svg" width={120} height={120} />}
        title={
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#5C4D58]">{title ? title : 'Nothing to see here'}</p>
            {showBtn && (
              <Button
                {...props}
                style={{
                  backgroundColor: '#000',
                  color: 'white',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                onClick={props.onClick}
                disabled={false}
                htmlType="button"
                className="whitespace-nowrap rounded-lg bg-[#fff] px-4 py-[20px] text-gray-800"
              >
                {text ? text : ''}
              </Button>
            )}
          </div>
        }
      />
    </div>
  )
}

export default EmptyResult
