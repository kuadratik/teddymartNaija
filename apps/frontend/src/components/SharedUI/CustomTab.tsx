import {Tabs} from 'antd'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

interface CustomTabProps {
  elements: Array<{
    tabTitle: React.ReactNode
    tabBody: React.ReactNode
    path: string
  }>
  className?: string
  tabPosition?: 'top' | 'bottom' | 'left' | 'right'
  extra?: React.ReactNode
}

const CustomRouteTab = ({elements, tabPosition = 'top', className}: CustomTabProps) => {
  const router = useRouter()
  const {tab} = router.query

  // Set default tab on initial load if no query param is set
  useEffect(() => {
    if (!tab) {
      router.replace({
        pathname: router.pathname,
        query: {...router.query, tab: elements[0].path} // default to the first tab
      })
    }
  }, [tab, elements, router])

  // @ts-ignore
  const customTabBar = (props, DefaultTabBar) => (
    <div className="p-2 min-w-[250px]">
      {' '}
      {/* Add padding and background */}
      <DefaultTabBar {...props} />
    </div>
  )

  return (
    <Tabs
      tabPosition={tabPosition}
      className={className}
      activeKey={tab as string}
      renderTabBar={customTabBar}
      onChange={key => {
        // Update the query string when the tab changes
        router.push({
          pathname: router.pathname,
          query: {...router.query, tab: key}
        })
      }}
      items={elements.map(val => ({
        key: val.path,
        label: <div className="px-1">{val.tabTitle}</div>,
        children: val.tabBody
      }))}
    />
  )
}

export default CustomRouteTab
