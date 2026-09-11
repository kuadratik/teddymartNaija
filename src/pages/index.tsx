import LandingPage from '@/components/Auth/Products'
import BaseLayout from '@/components/Layout/BaseLayout'
import {useState} from 'react'

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
