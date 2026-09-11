import {useState} from 'react'
import NavTabs from '../SharedUI/NavTabs'
import SavedProducts from './SavedProduct'
import SavedClassifiedAds from './SavedClassifiedAds'

const SavedItems = () => {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <div>
      <NavTabs
        backgroundColor="#F1F1F1"
        active={activeTab}
        setActive={setActiveTab}
        naveItems={[
          {id: 1, title: 'Products', link: ''},
          {id: 2, title: 'Classified Ads', link: ''}
        ]}
      />

      <div className="">{activeTab === 1 ? <SavedProducts /> : <SavedClassifiedAds/>}</div>
    </div>
  )
}

export default SavedItems
