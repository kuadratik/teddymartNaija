import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import useLogout from '@/components/Profile/hooks/useLogout'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import { useAppSelector } from '@/hooks/reduxHooks'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useGetAllClipsQuery } from '@/services/clips'
import { useRouter } from 'next/router'

const PrivacyPolicy = () => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const has_store = isAuthenticatedUser?.has_store

  const isAuth = isAuthenticatedToken
  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()
  const router = useRouter()

  const {data} = useGetAllClipsQuery({})

  return (
    <>
      <SEOHead
        title={`myEKI | Privacy Policy`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="mt-10 flex h-auto w-full lg:mt-20">
          <div className="w-full bg-white font-medium text-black">
            <div className="rounded bg-[#000000] p-6 text-center lg:p-10">
              <TextComponent as="h1" className="text-[32px] font-semibold leading-[41px] text-white">
                Privacy Policy
              </TextComponent>
              <p className="mt-[9px] text-white">Effective Date: Sep 19, 2024</p>
            </div>{' '}
            <div className="px-5 lg:px-0">
              <p className="mt-[13px] text-center text-[14px] leading-[30px] lg:px-40">
                Kuadratik Inc. ("we," "our," "us") values your privacy and is committed to protecting your personal
                information. This Privacy Policy outlines the types of data we collect from users of the myeki.market
                platform (the "Service"), how we use and protect that data, and your rights regarding your personal
                information.
              </p>
              <div className="container lg:px-[54px]">
                {' '}
                <div className="first">
                  <h2 className="mt-[40px] text-[17px] font-semibold">1. Information We Collect </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We collect personal and non-personal information that you provide when you:
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Register for an account.</li>
                    <li>Use our services to buy or sell products.</li>
                    <li>Contact us with inquiries, requests, or support issues.</li>
                    <li>Provide feedback or engage with the platform.</li>
                  </ul>

                  <p className="mt-[8px] text-[14px] leading-[30px]">The types of personal information may include: </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Name.</li>
                    <li>Email address.</li>
                    <li>Phone number.</li>
                    <li>Billing and shipping addresses.</li>
                    <li>Payment details (for transactions).</li>
                    <li>Usage data and device information.</li>
                    <li>
                      Authentication information (if you use Google login or other third-party authentication
                      providers).
                    </li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">2. How We Use Your Information </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We may use the personal information we collect to:{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Provide, operate, and manage the Service.</li>
                    <li>Facilitate and process transactions between buyers and sellers.</li>
                    <li>Authenticate users via third-party services like Google.</li>
                    <li>Improve and personalize your experience on the platform.</li>
                    <li>Communicate with you about updates, promotions, and customer service inquiries.</li>
                    <li>Comply with legal obligations and resolve any disputes.</li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">3. Customers </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    If you are a customer purchasing products or services on eki.market, we collect and use your
                    personal information to:{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Process your orders and facilitate transactions with sellers.</li>
                    <li>Send order confirmations, updates, and shipping notifications.</li>
                    <li>
                      Manage your preferences for communication, including marketing materials and service updates.
                    </li>
                    <li>
                      We may share information related to your purchases with the seller you transact with, including
                      your name, shipping address, and any other relevant details necessary for fulfilling your order.{' '}
                    </li>
                  </ul>
                  <p className="mt-[10px] text-[14px] leading-[30px]">
                    Your payment details are processed through third-party payment processors, and we do not store
                    sensitive payment information.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">4. Data Sharing and Disclosure </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We do not sell, trade, or otherwise transfer your personal information to outside parties without
                    your consent, except for:{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>
                      Vendors: We share your information to vendors selling on EKI, so they can reach out during
                      delivery as well as send updates with regards to stock availability or new service offerings.
                    </li>
                    <li>
                      Service providers: We share information with trusted service providers who assist in operating the
                      platform and processing transactions (e.g., payment processors, shipping partners).
                    </li>
                    <li>
                      Third-party authentication providers: If you log in using services like Google, certain
                      information is shared for authentication purposes.
                    </li>
                    <li>
                      Legal authorities: We may disclose your information when required by law or in the event of a
                      legal dispute, such as in response to a court order or to prevent fraud.
                    </li>
                  </ul>

                  <p className="mt-[10px] text-[14px] leading-[30px]">
                    We may share your data with service providers located outside your home jurisdiction. These third
                    parties are subject to local laws, which may differ from the protections in your region.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">5. Data Security </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We implement a variety of security measures to protect your personal information, including
                    encryption and secure servers. However, no method of transmission over the internet is 100% secure,
                    and we cannot guarantee the absolute security of your information. You are responsible for
                    maintaining the confidentiality of your account credentials.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">6. Cookies and Tracking Technologies</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We use cookies, web beacons, and similar tracking technologies to collect information about your
                    interactions with our platform. This helps us enhance your experience by personalizing content,
                    tracking orders, and analyzing usage patterns.{' '}
                  </p>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    You can control the use of cookies through your browser settings. You may opt out of certain
                    customized advertising by following the instructions provided by your browser or third-party tools.
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">7. Children’s Privacy</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We do not knowingly collect personal information from children under the age of 13. If we become
                    aware that a child under 13 has provided us with personal information, we will take steps to delete
                    it. If you believe we have collected such data, please contact us at privacy@myeki.com.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">8. Your Rights</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    Depending on your location, you may have the right to:{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Access the personal information we hold about you.</li>
                    <li>Request correction or deletion of your personal information.</li>
                    <li>Object to the processing of your personal information.</li>
                    <li>Withdraw consent where the processing is based on consent.</li>
                    <li>To exercise these rights, please contact us at privacy@myeki.market.</li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">9. Changes to the Privacy Policy</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with an
                    updated effective date. By continuing to use the Service after changes are posted, you agree to the
                    updated policy.{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

PrivacyPolicy.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default PrivacyPolicy
