import LandingPage from '@/components/Auth/Products'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useEffect, useState} from 'react'

export default function Home() {
  return (
    <>
      <BaseLayout className="">
        <main className="">
          <LandingPage />
        </main>
      </BaseLayout>
    </>
  )
}
