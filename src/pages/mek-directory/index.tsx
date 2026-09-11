import AllCategory, {ISelectedCategory} from '@/components/Auth/Products/components/AllCategory'
import AllIndustry from '@/components/Auth/Products/components/AllIndustry'
import MekBanner from '@/components/Auth/Products/components/MekBanner'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import MekDirectories from '@/components/Business/MekDirectories'
import CustomerLayout from '@/components/Layout/Customerlayout'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import styled from '@emotion/styled'
import {useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'

const MekDirectory = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<ISelectedCategory[]>([])

  useEffect(() => {
    console.log('selectedCategory', selectedCategories)
  }, [selectedCategories])
  return (
    <div>
      <SEOHead
        title={`MEK Directory | myEKI`}
        description="Find products and services near you!! Get Listed on myEKI and start selling for free!"
      />
      <main className="flex w-full flex-col gap-8">
        <div className="flex w-full flex-col">
          <AllIndustry open={open} setOpen={setOpen} setSelectedCategories={setSelectedCategories} />
          <div className="flex w-full flex-col-reverse lg:flex-col">
            <NewNavigation />
            <div className="w-full max-w-5xl lg:mx-auto">
              <SearchWrapper className="py-4">
                <div className="container">
                  <TextInput
                    iconName="streamline:industry-innovation-and-infrastructure-solid"
                    iconClick={() => {
                      setOpen(true)
                    }}
                    iconClassName="cursor-pointer"
                    className=""
                    placeholder={`Search for a business `}
                    onChange={e => {
                      setSearch(e.target.value)
                    }}
                    name={''}
                    value={search}
                    type={'text'}
                    // onKeyDown={e => {
                    //   if (e.key === 'Enter') {
                    //     router.push('/search?id=' + search)
                    //   }
                    // }}
                  />
                </div>
              </SearchWrapper>
            </div>
          </div>
        </div>
        <MekDirectories
          search={search}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <MekBanner />
      </main>
    </div>
  )
}

MekDirectory.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default MekDirectory

const SearchWrapper = styled(tw.div`
mx-auto flex items-center justify-center bg-black px-3 py-[25px] md:mt-5 lg:rounded-[12px] lg:px-0`)`
  .container {
    position: relative;
    width: 100%;
    margin: 0 auto;

    @media (min-width: 1024px) {
      max-width: 735px;
    }
  }

  .second-container {
    position: absolute;
    left: 0.5rem;
    top: 10px;
    z-index: 40;
    display: flex;
    height: 20px;
    width: 80px;
    align-items: flex-start;
    justify-content: flex-start;
    border-right: 1px solid #d1d5db; /* border-r-gray-300 */
    padding-right: 0.25rem; /* pr-1 */

    @media (min-width: 1024px) {
      left: 1rem; /* 4 in Tailwind (16px) */
      top: 50%;
      width: 87px;
      transform: translateY(-50%);
      padding-right: 13px;
    }
  }
`
