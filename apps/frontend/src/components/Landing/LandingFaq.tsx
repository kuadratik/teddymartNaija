import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'

const LandingFaq = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  console.log('🚀 ~ FAQSection ~ expandedIndex:', expandedIndex)

  const faqItems = [
    {
      question: 'What is myEKI, and how does it work?',
      answer:
        'myEKI is an all-in-one marketplace that connects vendors, riders, shippers, and businesses with customers locally and globally. From selling products to offering services, delivering goods, and promoting businesses, myEKI provides tools and opportunities to grow and connect with your audience.'
    },
    {
      question: 'Who can use myEKI?',
      answer:
        'Browse our extensive marketplace, search for products or services, and place your order directly. Choose local delivery or international shipping for convenience.'
    },
    {
      question: 'Are the products on myEKI authentic?',
      answer:
        'Yes! myEKI partners with trusted vendors to ensure you receive high-quality, authentic African products and services.'
    },
    {
      question: 'Can I contact vendors directly?',
      answer:
        'Absolutely! You can chat with vendors to ask questions, get more details about products or services, and finalize your purchases confidently.'
    },
    {
      question: 'How do I become a vendor on myEKI?',
      answer:
        'Signing up is easy! Create an account on myEKI.market, set up your store, and start listing your products or services to connect with customers locally and globally.'
    },
    {
      question: 'What tools does myEKI provide for vendors?',
      answer:
        'myEKI offers tools for product management, order tracking, marketing, and analytics to help grow your business and reach more customers.'
    },
    {
      question: 'Can I sell both products and services?',
      answer:
        'Yes, myEKI supports vendors selling physical products, digital goods, and services, making it a versatile platform for all businesses.'
    },
    {
      question: 'How do I become a shipper with myEKI?',
      answer:
        'Create a shipper account on our platform, set up your logistics details, and start receiving shipping requests from vendors who need local or international delivery services.'
    },
    {
      question: 'What are the benefits of being a myEKI shipper?',
      answer:
        'As a shipper, you gain access to a growing customer base, tools to streamline logistics, and the ability to expand your business both locally and internationally.'
    },
    {
      question: 'How can I join myEKI as a rider?',
      answer:
        'Simply sign up on myEKI.market, complete your rider profile, and start earning by delivering goods for vendors within your city or town.'
    },
    {
      question: 'Do I need special equipment to become a rider?',
      answer: 'No, you can use any reliable vehicle—bike, car, or van—that suits the type of deliveries in your area.'
    },
    {
      question: 'Do I need a storefront to post an ad on myEKI?',
      answer:
        'No storefront? No problem! With myEKI Ads, you can list your item or service directly, making it easy to reach potential buyers without setting up a store.'
    },
    {
      question: 'What kinds of ads can I post?',
      answer:
        'You can post items for sale, services offered, or any classified listing to connect with customers or clients in your area.'
    },
    {
      question: 'What is the myEKI Directory, and how does it work?',
      answer:
        'The myEKI Directory is a comprehensive business listing platform. Simply create a profile to showcase your business, attract new clients, and increase your visibility locally and globally.'
    },
    {
      question: 'Can I use the directory without selling products on myEKI?',
      answer:
        'Yes, the myEKI Directory is designed for all businesses—whether you sell products, provide services, or operate offline.'
    }
  ]

  return (
    <section className="py-10">
      <div className="mx-auto px-4 md:max-w-3xl">
        <motion.h2
          initial={{opacity: 0, y: -30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className="mb-12 text-center text-4xl font-bold text-white"
        >
          <h2 className="text-center text-[30px] font-bold leading-[56px] text-[#6B7280] lg:text-[40px]">
            <span className="text-[#000]"> Frequently Asked</span> Questions
          </h2>
        </motion.h2>

        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: index * 0.1}}
              className="border-b border-gray-200 last:border-none"
            >
              <motion.button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-4 py-5 transition-colors duration-300"
              >
                <span className="w-[80%] text-left text-lg font-medium text-[#4D4D4D] hover:opacity-70 md:w-full">
                  {item.question}
                </span>
                <motion.div
                  animate={{rotate: expandedIndex === index ? 180 : 0}}
                  transition={{duration: 0.3}}
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <svg className="h-4 w-4 text-[#4D4D4D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: {duration: 0.3},
                        opacity: {duration: 0.3, delay: 0.1}
                      }
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: {duration: 0.3},
                        opacity: {duration: 0.2}
                      }
                    }}
                    className="overflow-hidden bg-gray-50"
                  >
                    <motion.div
                      initial={{y: -10, opacity: 0}}
                      animate={{y: 0, opacity: 1}}
                      exit={{y: -10, opacity: 0}}
                      transition={{duration: 0.3}}
                      className="p-4 text-gray-600"
                    >
                      {item.answer}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingFaq
