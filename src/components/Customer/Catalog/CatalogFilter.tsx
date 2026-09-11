import {Categories} from '@/components/Auth/Products/utils'
import TextComponent from '@/components/SharedUI/TextComponent'
import {StyledContentWrapper} from '@/components/Vendor/components/Order/OrderLogisticsView'
import {onPreventMouseDown} from '@/components/Vendor/components/Product/AddProduct/BulkUploadForm'
import useQueryParams from '@/hooks/useQueryParams'
import debounce from '@/utils/debounce'
import {CloseOutlined} from '@ant-design/icons'
import {Radio, RadioChangeEvent, Rate, Slider, Tag} from 'antd'
import {Collapse} from 'antd'

import React, {useCallback, useEffect, useState} from 'react'

const {Panel} = Collapse

const {CheckableTag} = Tag
const tagsArr = [
  'Healthy',
  'Low fat',
  'Vegetarian',
  'Meat',
  'Kid foods',
  'Vitamins',
  'Bread',
  'Snacks',
  'Tiffin',
  'Launch',
  'Dinner',
  'Breakfast',
  'Fruit'
]

const CategoriesFilter = [
  {
    text: 'Fresh Fruits',
    value: 'fresh_fruits'
  },
  {
    text: 'Vegetables',
    value: 'vegetables'
  },
  {
    text: 'Cooking',
    value: 'cooking'
  },
  {
    text: 'Snacks',
    value: 'snacks'
  },
  {
    text: 'Beverages',
    value: 'beverages'
  },
  {
    text: 'Beauty & Health',
    value: 'beauty_health'
  },
  {
    text: 'Bread & Bakery',
    value: 'breaad_bakery'
  }
]

const RatingFilter = [
  {
    text: 5,
    value: '5'
  },
  {
    text: 4,
    value: '4-5'
  },
  {
    text: 3,
    value: '3-5'
  },
  {
    text: 2,
    value: '2-5'
  },
  {
    text: 1,
    value: '1-5'
  }
]

const CatalogFilter = () => {
  const {queryParams, updateQueryParams} = useQueryParams<{
    category: string
    min?: any
    max?: any
    rating?: any
    tag?: string
  }>({
    category: '',
    min: 0,
    max: 0
  })

  const [rangeValue, setRangeValue] = useState([queryParams?.min, queryParams?.max]) // Initial range values

  const [rating, setRating] = useState(queryParams?.rating) // Initial range values

  const [category, setCategory] = useState(queryParams?.category) // Initial range values

  const [selectedTag, setSelectedTag] = useState<any>(queryParams?.tag) // Store the single selected tag

  // Update rating when queryParams.rating changes
  useEffect(() => {
    if (queryParams?.rating !== undefined) {
      setRating(queryParams.rating)
    }
  }, [queryParams?.rating])

  // Update rating when queryParams.rating changes
  useEffect(() => {
    if (queryParams?.category !== undefined) {
      setRating(queryParams.category)
    }
  }, [queryParams?.category])

  useEffect(() => {
    if (queryParams?.tag !== undefined) {
      setSelectedTag(queryParams.tag)
    }
  }, [queryParams?.tag])

  const [tags, setTags] = useState(['Filter 1', 'Filter 2', 'Filter 3', 'Filter 4', 'Filter 5', 'Filter 6'])

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    setTags(newTags)
  }

  const onChange = useCallback(
    debounce((e: RadioChangeEvent) => {
      updateQueryParams({
        category: e.target.value
      })
    }, 1000),
    []
  )

  const onTagChange = useCallback(
    debounce((tag: string) => {
      updateQueryParams({
        tag: tag
      })
    }, 1000),
    []
  )

  const ratingOnChange = useCallback(
    debounce((e: RadioChangeEvent) => {
      updateQueryParams({
        rating: e.target.value
      })
    }, 1000),
    []
  )

  // Format the tooltip value to display as currency
  const formatter = (val: any) => `${val}`

  // * This debounce function update the search queryParams and delays executing the api request
  const priceSearch = useCallback(
    debounce((value: Number[]) => {
      updateQueryParams({
        min: value[0],
        max: value[1]
      })
    }, 1000),
    []
  )

  const handleChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTag(tag) // Set the new selected tag
    } else {
      setSelectedTag(null) // Deselect the tag if clicked again
    }
  }

  return (
    <div>
      <StyledContentWrapper className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-[1.5px] pb-3">
          <TextComponent as="p" className="text-[16px] font-bold leading-[15.23px] text-black">
            Filters
          </TextComponent>
          <button className="cursor-pointer text-[14px] leading-[15.23px] text-black hover:underline">Clear All</button>
        </div>

        {tags.length ? (
          <div className="border-b-[1.5px] pb-3">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {' '}
              {tags.map((value, index) => {
                return (
                  <Tag
                    closable
                    closeIcon={<CloseOutlined style={{fontSize: '14px', color: '#6B7280'}} />}
                    onClose={e => {
                      e.preventDefault()
                      handleClose(value)
                    }}
                    className="flex items-center rounded-[7px] !border-none bg-[#CFD6E457] p-1 px-3 font-inter text-[#6B7280]"
                    onMouseDown={onPreventMouseDown}
                  >
                    <div className="p-1 text-sm font-semibold">{value}</div>
                  </Tag>
                )
              })}
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* Category */}
        <Collapse expandIconPosition="right" className="custom-collapse !border-none bg-transparent">
          <Panel
            header={
              <TextComponent as="p" className="text-[16px] font-bold leading-[15.23px] text-black">
                Categories
              </TextComponent>
            }
            key="1"
            className=""
          >
            <Radio.Group
              onChange={e => {
                setCategory(e.target.value)
                onChange(e)
              }}
              className="flex flex-col gap-[9px]"
              value={category}
            >
              {CategoriesFilter?.map((category, index) => (
                <Radio key={index} value={category.value} className="text-sm text-[#6B7280]">
                  {category.text}
                </Radio>
              ))}
            </Radio.Group>
          </Panel>
        </Collapse>

        {/* price */}
        <Collapse accordion expandIconPosition="right" className="custom-collapse !border-none bg-transparent">
          <Panel
            header={
              <TextComponent as="p" className="text-[16px] font-bold leading-[15.23px] text-black">
                Price
              </TextComponent>
            }
            key="1"
            className=""
          >
            <Slider
              range
              min={0}
              max={5000}
              value={rangeValue}
              step={100} // Increment by 100
              onChange={val => {
                setRangeValue(val)
                priceSearch(val)
              }}
              tipFormatter={formatter} // Show formatted tooltip
            />
            <p>{/* Selected range: {formatter(queryPriceFormatted[0])} - {formatter(queryPriceFormatted[1])} */}</p>{' '}
          </Panel>
        </Collapse>

        {/* rating */}

        <Collapse accordion expandIconPosition="right" className="custom-collapse !border-none bg-transparent">
          <Panel
            header={
              <TextComponent as="p" className="text-[16px] font-bold leading-[15.23px] text-black">
                Rating
              </TextComponent>
            }
            key="1"
            className=""
          >
            <Radio.Group
              onChange={e => {
                setRating(e.target.value)
                ratingOnChange(e)
              }}
              className="flex flex-col gap-[9px]"
              value={rating}
            >
              {RatingFilter?.map((category, index) => (
                <Radio key={index} value={category.value} className="text-sm text-[#6B7280]">
                  <Rate value={category.text} disabled count={5} /> {category?.text == 5 ? `` : `${category.text} & up`}
                </Radio>
              ))}
            </Radio.Group>
          </Panel>
        </Collapse>

        {/* tags */}
        <Collapse accordion expandIconPosition="right" className="custom-collapse !border-none bg-transparent">
          <Panel
            header={
              <TextComponent as="p" className="text-[16px] font-bold leading-[15.23px] text-black">
                Tags
              </TextComponent>
            }
            key="1"
            className=""
          >
            {tagsArr.map(tag => (
              <CheckableTag
                className="custom-checkable-tag"
                key={tag}
                checked={selectedTag === tag} // Only the selected tag will be true
                onChange={checked => {
                  handleChange(tag, checked)
                  onTagChange(tag)
                }}
              >
                {tag}
              </CheckableTag>
            ))}
          </Panel>
        </Collapse>
      </StyledContentWrapper>
    </div>
  )
}

export default CatalogFilter
