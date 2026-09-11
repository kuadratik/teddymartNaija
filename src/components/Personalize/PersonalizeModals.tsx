import {useGetUserAdsGalleryQuery} from '@/services/Adsgallery'
import {useActiveUserQuery} from '@/services/auth'
import {useBusinessListingsQuery} from '@/services/myBussiness'
import React, {useState} from 'react'
import PlannerModal from '../SharedUI/ModalComponent'
import ChooseCountry from './ChooseCountry'
import ListAdsModal from './ListAdsModal'
import ListBusinessModal from './ListBusinessModal'
import SellProductModal from './SellProductModal'
import WhatToDoInEki from './WhatToDoInEki'

interface IProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  modalOpen: boolean
  setHasSeenCountryModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  hasSeenCountryModal: boolean | undefined
  handleModalClose: () => void
}
const PersonalizeModals = ({
  setModalOpen,
  modalOpen,
  setHasSeenCountryModal,
  hasSeenCountryModal,
  handleModalClose
}: IProps) => {
  const [whatTodoModal, setWhatTodoModal] = useState(false)
  const [sellProductModal, setSellProductModal] = useState(false)
  const [listBusinessModal, setListBusinessModal] = useState(false)
  const [lisAdsModal, setLisAdsModal] = useState(false)
  const {
    data: adsInfo,
    isLoading: adsIsLoading,
    isFetching: adsIsFetching,
    isSuccess,
    refetch
  } = useGetUserAdsGalleryQuery({
    params: {
      page: 1,
      per_page: 4
    }
  })
  const {data: activeUserData, isLoading: activeUserisLoading} = useActiveUserQuery({})
  const {data: businessData, isLoading} = useBusinessListingsQuery({
    search: '',
    industry: undefined,
    page: 1,
    limit: 3,
    user: activeUserData?.data?.id as any
  })
  const data = adsInfo?.data?.data || []
  return (
    <>
      {' '}
      <PlannerModal
        onCloseModal={() => {
          setModalOpen(false)
          setHasSeenCountryModal(true) // Mark that user has seen the modal
          handleModalClose() // Close the modal
        }}
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        width={600}
        wrapClassName="bg-black/70"
        modalStyles={{
          body: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          },
          content: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          }
        }}
        className="rounded-lg bg-white shadow-f2"
      >
        <div className="">
          <ChooseCountry
            handleModalClose={handleModalClose}
            setWhatTodoModal={setWhatTodoModal}
            setModalOpen={setModalOpen}
          />
        </div>
      </PlannerModal>
      <PlannerModal
        onCloseModal={() => setWhatTodoModal(false)}
        setModalOpen={setWhatTodoModal}
        modalOpen={whatTodoModal}
        width={500}
        wrapClassName="bg-black/70"
        modalStyles={{
          body: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          },
          content: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          }
        }}
        className="rounded-lg bg-white shadow-f2"
      >
        <div className="">
          <WhatToDoInEki
            setWhatTodoModal={setWhatTodoModal}
            whatTodoModal={whatTodoModal}
            setModalOpen={setModalOpen}
            setLisAdsModal={setLisAdsModal}
            setListBusinessModal={setListBusinessModal}
            setSellProductModal={setSellProductModal}
          />
        </div>
      </PlannerModal>
      <PlannerModal
        onCloseModal={() => setSellProductModal(false)}
        setModalOpen={setSellProductModal}
        modalOpen={sellProductModal}
        width={500}
        wrapClassName="bg-black/70"
        modalStyles={{
          body: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          },
          content: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          }
        }}
        className="rounded-lg bg-white shadow-f2"
      >
        <div className="">
          <SellProductModal
            setWhatTodoModal={setWhatTodoModal}
            whatTodoModal={whatTodoModal}
            setModalOpen={setModalOpen}
            setLisAdsModal={setLisAdsModal}
            setListBusinessModal={setListBusinessModal}
            setSellProductModal={setSellProductModal}
          />
        </div>
      </PlannerModal>
      <PlannerModal
        onCloseModal={() => setListBusinessModal(false)}
        setModalOpen={setListBusinessModal}
        modalOpen={listBusinessModal}
        width={500}
        wrapClassName="bg-black/70"
        modalStyles={{
          body: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          },
          content: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          }
        }}
        className="rounded-lg bg-white shadow-f2"
      >
        <div className="">
          <ListBusinessModal
            data={businessData?.data}
            setWhatTodoModal={setWhatTodoModal}
            whatTodoModal={whatTodoModal}
            setModalOpen={setModalOpen}
            setLisAdsModal={setLisAdsModal}
            setListBusinessModal={setListBusinessModal}
            setSellProductModal={setSellProductModal}
          />
        </div>
      </PlannerModal>
      <PlannerModal
        onCloseModal={() => setLisAdsModal(false)}
        setModalOpen={setLisAdsModal}
        modalOpen={lisAdsModal}
        width={500}
        wrapClassName="bg-black/70"
        modalStyles={{
          body: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          },
          content: {
            backgroundColor: 'white',
            padding: 0,
            overflow: 'auto'
          }
        }}
        className="rounded-lg bg-white shadow-f2"
      >
        <div className="">
          <ListAdsModal
            data={data}
            setWhatTodoModal={setWhatTodoModal}
            whatTodoModal={whatTodoModal}
            setModalOpen={setModalOpen}
            setLisAdsModal={setLisAdsModal}
            setListBusinessModal={setListBusinessModal}
            setSellProductModal={setSellProductModal}
          />
        </div>
      </PlannerModal>
    </>
  )
}

export default PersonalizeModals
