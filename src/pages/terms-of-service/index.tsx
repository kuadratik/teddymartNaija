import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'

const TermsofUse = () => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  return (
    <>
      <SEOHead
        title={`myEKI | Terms of Service`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="mt-10 flex h-auto w-full lg:mt-20">
          <div className="w-full bg-white font-medium text-black">
            <div className="rounded bg-[#000000] p-6 text-center lg:p-10">
              <TextComponent as="h1" className="text-[32px] font-semibold leading-[41px] text-white">
                Terms of Service{' '}
              </TextComponent>
              <p className="mt-[9px] text-white">Effective Date: Sep 19, 2024</p>
            </div>{' '}
            <div className="px-5 lg:px-0">
              <p className="mt-[13px] text-center text-[14px] leading-[30px] lg:px-40">
                These Terms of Service ("Terms") govern your use of the eki.market platform ("Service"), operated by
                Kuadratik Inc. ("we," "our," "us"). By accessing or using our Services, you agree to comply with these
                Terms. If you do not agree, you may not use our Services.{' '}
              </p>
              <div className="container lg:px-[54px]">
                {' '}
                <div className="first">
                  <h2 className="mt-[40px] text-[17px] font-semibold">1.  Acceptance of Terms </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    By using the Services, you agree to be bound by these Terms and our Privacy Policy. You represent
                    that you are at least 18 years old and have the legal authority to enter into these Terms.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">2. User Account</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    To access certain features of the Service, you may need to create an account. You agree to:{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Provide accurate, current, and complete information during registration.</li>
                    <li>
                      Maintain the confidentiality of your account credentials and are responsible for any activities
                      that occur under your account.
                    </li>
                    <li>
                      Notify us immediately of any unauthorized access or security breaches related to your account.
                    </li>
                    <li>
                      You may not transfer or share your account with others without prior written permission from
                      Kuadratik Inc.
                    </li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">3. Marketplace Transactions </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    EKI.MARKET provides a platform for users to buy and sell products and services. As a marketplace, we
                    do not own or sell the items listed on our platform. All transactions and agreements for the
                    purchase or sale of items are made directly between buyers and sellers.{' '}
                  </p>
                  <p className="mt-[10px] text-[14px] leading-[30px]">By using the Service, you agree: </p>

                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>
                      To complete transactions you commit to, unless an exceptional circumstance applies (e.g., the
                      seller materially changes the item after purchase, a clear typographical error is made, or you
                      cannot authenticate the seller’s identity)
                    </li>
                    <li>
                      That all fees associated with a purchase or sale must be paid as outlined in our payment
                      processing policies.
                    </li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">4. Customers </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    If you are a customer purchasing products or services on eki.market, you agree to:{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Review all item descriptions and seller policies before completing a transaction. </li>
                    <li>Ensure that your payment details are accurate and up to date to avoid any payment issues. </li>
                    <li>
                      Understand that all purchases are subject to the seller's return, refund, and exchange policies,
                      as outlined on their product listings.{' '}
                    </li>
                    <li>
                      In case of dissatisfaction with a product or service, you are encouraged to first contact the
                      seller directly to resolve the issue. If the matter remains unresolved, you can reach out to the
                      eki.market support team for assistance. However, Kuadratik Inc. does not guarantee a resolution
                      and is not responsible for the quality, safety, or legality of items sold on the platform.{' '}
                    </li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">5. Seller Responsibilities</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    If you are a seller on eki.market, you agree to:{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Provide accurate descriptions and images of the products and services listed. </li>
                    <li>Fulfill any orders placed through the Service in a timely manner. </li>
                    <li>
                      Comply with all applicable laws and regulations regarding the sale and distribution of your
                      products.{' '}
                    </li>
                    <li>
                      Kuadratik Inc. reserves the right to remove listings that violate these Terms or that are deemed
                      inappropriate or harmful to users.{' '}
                    </li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">6. Prohibited Activities</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">You are prohibited from: </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>Using the Service for any unlawful purpose or to engage in fraudulent activities. </li>
                    <li>Interfering with other users' access to the Service or disrupting its operations.</li>
                    <li>Attempting to gain unauthorized access to the Service, accounts, or networks. </li>
                    <li>Uploading or distributing malicious software, viruses, or harmful code. </li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">7. Intellectual Property</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    All content, including text, graphics, logos, images, and software available through the Service, is
                    the property of Kuadratik Inc. or its licensors and is protected by intellectual property laws. You
                    are granted a limited, non-exclusive license to access and use the Service for personal and
                    non-commercial purposes.{' '}
                  </p>
                  <p className="mt-[10px] text-[14px] leading-[30px]">
                    Users may not reproduce, distribute, modify, or create derivative works of any content without our
                    express written consent.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">8. Third-Party Authentication</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    If you choose to log in using Google authentication or any other third-party service, you agree to
                    comply with the terms and conditions of those services. Kuadratik Inc. is not responsible for any
                    data shared with or collected by third-party services during authentication.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">9. Fees and Payment</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    Certain features of the Service may be subject to payment. You agree to pay all applicable fees or
                    charges associated with your account and any transactions, and all payments must be made in
                    accordance with our payment processing policies.{' '}
                  </p>
                  <p className="mt-[10px] text-[14px] leading-[30px]">
                    We may use third-party payment processors, and by using the Service, you agree to the terms and
                    conditions of those processors.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">
                    10. Dispute Resolution Between Buyers and Sellers
                  </h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    EKI.MARKET facilitates interactions between buyers and sellers but is not responsible for resolving
                    disputes arising from marketplace transactions. We encourage users to communicate and resolve
                    disputes amicably.{' '}
                  </p>
                  <p className="mt-[10px] text-[14px] leading-[30px]">
                    In the event of a dispute, you may contact our support team for assistance, but Kuadratik Inc. does
                    not guarantee resolution.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">11. Limitation of Liability</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    To the fullest extent permitted by law, Kuadratik Inc. shall not be liable for any indirect,
                    incidental, special, consequential, or punitive damages, including but not limited to::{' '}
                  </p>
                  <ul className="mt-[13px] list-inside list-disc px-4 text-[14px] leading-[30px]">
                    <li>
                      Loss of revenue, profits, or data arising from your use of or inability to use the Service.{' '}
                    </li>
                    <li>Any unauthorized access to or alteration of your data.</li>
                    <li>
                      Any bugs, viruses, malware, or harmful code that may be transmitted through the Service by a third
                      party.
                    </li>
                  </ul>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">12. Termination</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We reserve the right to suspend or terminate your account and access to the Service at our sole
                    discretion, without notice or liability, for any reason, including if you violate these Terms.{' '}
                  </p>
                  <p className="mt-[10px] text-[14px] leading-[30px]">
                    Upon termination, all provisions of these Terms which, by their nature, should survive termination
                    (including intellectual property rights, indemnity, and limitations of liability) will continue to
                    apply.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">13. Changes to the Terms</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    We may update these Terms from time to time. Changes will be posted on the platform, and your
                    continued use of the Service after any changes become effective constitutes acceptance of the
                    updated Terms.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">14. Governing Law</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    These Terms shall be governed by and construed in accordance with the laws of Canada, without regard
                    to conflict of law principles. Any disputes arising from these Terms or your use of the Service will
                    be subject to the exclusive jurisdiction of the courts located in Canada.{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">15. Disclaimer of Warranties</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    The Services are provided on an "as-is" and "as-available" basis. Kuadratik Inc. through the
                    platform EKI.MARKET makes no warranties, express or implied, regarding the Services, including but
                    not limited to implied warranties of merchantability, fitness for a particular purpose, or
                    non-infringement{' '}
                  </p>
                </div>
                <div className="">
                  <h2 className="mt-[40px] text-[17px] font-semibold">16. Contact Us</h2>
                  <p className="mt-[20px] text-[14px] leading-[30px]">
                    If you have any questions or concerns regarding these Terms, please contact us at
                    privacy@myeki.market.com{' '}
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

TermsofUse.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default TermsofUse
