import {Select, Tag} from 'antd'
import {useState} from 'react'

interface IProps {
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  selectedItems: string[]
  setSelectedItems: any
  handleChange: (values: string[]) => void
  handleInputChange: (value: string) => void
  placeholder: string
}
const {Option} = Select

const AddselectTags = ({
  inputValue,
  setInputValue,
  selectedItems,
  setSelectedItems,
  handleChange,
  handleInputChange,
  placeholder
}: IProps) => {
  // const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState(false)
  // const [selectedItems, setSelectedItems] = useState(["gold", "cyan"]);

  // const handleChange = (values: string[]) => {
  //   setSelectedItems(values);
  // };

  // const handleInputChange = (value: string) => {
  //   setInputValue(value);
  // };

  const handleInputConfirm = (): any => {
    if (inputValue && selectedItems.indexOf(inputValue) === -1) {
      setSelectedItems([...selectedItems, inputValue])
    }
    setInputValue('')
    setVisible(!visible)
  }

  const tagRender = (props: any) => {
    const {label, closable, onClose} = props
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{marginRight: 5, marginLeft: 5}}
        className="flex items-center font-inter"
        onMouseDown={onPreventMouseDown}
      >
        <div className="p-1 text-sm font-semibold text-school">{label}</div>
      </Tag>
    )
  }

  return (
    <div className="rounded-[8px] border py-[3px] hover:border-school focus:outline-none focus:ring-1 focus:ring-school">
      <Select
        mode="tags"
        size="large"
        variant="borderless"
        className="font-inter"
        value={selectedItems}
        onChange={handleChange}
        tagRender={tagRender}
        placeholder={placeholder}
        open={visible}
        onDropdownVisibleChange={open => setVisible(open)}
        maxTagCount="responsive"
        style={{width: '100%'}}
        dropdownRender={menu => (
          <div className="font-inter">
            {menu}
            <div className="" style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
              <input
                style={{flex: 'auto', border: 'none', outline: 'none'}}
                className=""
                // value={inputValue}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleInputConfirm()
                    // close the menu
                  }
                }}
                onChange={e => handleInputChange(e.target.value)}
                onBlur={handleInputConfirm}
                // onPressEnter={handleInputConfirm as any}
              />
              <button onClick={handleInputConfirm}>Add</button>
            </div>
          </div>
        )}
      >
        {Array.isArray(selectedItems) &&
          selectedItems.map(item => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
      </Select>
    </div>
  )
}

export default AddselectTags
