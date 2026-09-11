import useLogout from '@/components/Profile/hooks/useLogout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import CountrySelect from '@/components/SharedUI/CountrySelect/CountrySelect'
import Spinner from '@/components/SharedUI/Spinner'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {setSelectedLanguage} from '@/redux/apiSlice/countrySlice'
import {useGetAllClipsQuery} from '@/services/clips'
import {Icon} from '@iconify/react'
import {Badge, Button} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'

const NavBar = () => {
  const router = useRouter()

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const {data, isLoading, isFetching} = useGetAllClipsQuery({})

  const has_store = isAuthenticatedUser?.has_store

  const isAuth = isAuthenticatedToken

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()

  const {selectionOccurred} = useAppSelector(state => state.country)
  const dispatch = useAppDispatch()
  const [location, setLocation] = useState<{lat: number | null; lng: number | null}>({lat: null, lng: null})
  const [country, setCountry] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Function to get user's latitude and longitude
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords
          setLocation({lat: latitude, lng: longitude})
        },
        error => {
          setError(error.message)
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }, [])

  // Function to get user's latitude and longitude
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords
          setLocation({lat: latitude, lng: longitude})
        },
        error => {
          setError(error.message)
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }, [])

  // Function to get the country from lat/lng using OpenStreetMap Nominatim API
  useEffect(() => {
    const getCountry = async () => {
      if (location.lat && location.lng) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          )
          const data = await response.json()

          if (data && data.address && data.address.country) {
            const foundCountry = data.address.country
            // Checking the country
            if (foundCountry === 'Nigeria') {
              // console.log("User is in Nigeria");
              dispatch(
                setSelectedLanguage({
                  key: 'ng',
                  value: 'NG',
                  name: 'Nigeria'
                })
              )
            } else if (foundCountry === 'United States') {
              // console.log('User is in the United States')
              dispatch(
                setSelectedLanguage({
                  key: 'us',
                  value: 'US',
                  name: 'United States'
                })
              )
            } else if (foundCountry === 'Canada') {
              dispatch(
                setSelectedLanguage({
                  key: 'ca',
                  value: 'CA',
                  name: 'Canada'
                })
              )
            } else {
              dispatch(
                setSelectedLanguage({
                  key: 'us',
                  value: 'US',
                  name: 'United States'
                })
              )
            }

            setCountry(foundCountry) // Set the country name
          } else {
            setError('Unable to get country from coordinates.')
          }
        } catch (error) {
          setError('Error fetching geolocation data.')
        }
      }
    }

    selectionOccurred === false && getCountry()
  }, [location])

  return (
    <div className="fixed top-0 z-50 flex h-[78px] w-full items-center bg-[#222222]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="!border-none !p-0">
          <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={76} />
        </Link>

        <div className="flex items-center gap-3">
          {isAuth ? (
            <div className="flex gap-4">
              {has_store && (
                <CustomButton
                  onClick={() => {
                    router.push('/vendor')
                  }}
                  type="button"
                  className="w-[180px] whitespace-nowrap rounded-[10px] !border-[1px] !border-[#000000] bg-white px-1 py-2"
                >
                  Switch to Vendor
                </CustomButton>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    logoutUserHandler()
                  }}
                  disabled={isLoadingLogout}
                  type="button"
                  className="bg-transparent text-sm font-semibold text-white"
                >
                  <span>Logout</span>
                </button>
                <span className="">{isLoadingLogout ? <Spinner className="h-2 w-2" /> : null}</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <CustomButton
                onClick={() => {
                  router.push('auth/sign-up')
                }}
                type="button"
                className="h-[44px] w-[129px] rounded-[10px] bg-white px-1 py-2"
              >
                Sign Up
              </CustomButton>
              <CustomButton
                onClick={() => {
                  router.push('auth/login')
                }}
                type="button"
                className="w-[100px] rounded-[10px] border-[1px] border-white bg-[#222222] px-2 py-1 text-white"
              >
                Login
              </CustomButton>
            </div>
          )}

          <Button
            onClick={() => {
              router.push('/clips')
            }}
            type="text"
            className="flex-center"
            size="large"
            icon={
              <Badge
                count={data?.data?.total_items}
                style={{backgroundColor: '#FFF', color: '#000', fontSize: '16px', fontWeight: 600}}
              >
                <Icon icon={'mdi-light:cart'} className="text-[28px] text-white" />
              </Badge>
            }
          />

          <CountrySelect />
        </div>
      </div>
    </div>
  )
}

export default NavBar
