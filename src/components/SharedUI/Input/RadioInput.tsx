import { Radio } from 'antd'
import React from 'react'

interface IProps {
  value: number | string | boolean
  setValue?: React.Dispatch<React.SetStateAction<number>>
  textContent: string
}
const RadioInput = ({ value, setValue, textContent }: IProps) => {
  // const [value, setValue] = useState(1);

  // const onChange = (e: RadioChangeEvent) => {
  //   console.log("radio checked", e.target.value);
  //   setValue(e.target.value);
  // };
  return (
    <Radio
      value={value}
      className="w-full rounded-[8px]  border border-[#dfdcdc] p-[10px] hover:border-school focus:outline-none focus:ring-1 focus:ring-school"
    >
      <p className="capitalize">{textContent}</p>
    </Radio>
  )
}

export default RadioInput
