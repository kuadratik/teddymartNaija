import {useState} from 'react'
import * as yup from 'yup'
import CustomButton from '../SharedUI/Buttons/Button'
import TextAreaInput from '../SharedUI/Input/TextAreaInput'
import TextInput from '../SharedUI/Input/TextInput'

export const contactValidateSchema = yup.object().shape({
  name: yup.string().required('Name field is required'),
  feedback: yup.string().required('Feedback field is required')
})
const LandingContactForm = () => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const [formValues, setFormValues] = useState({
    name: '',
    // email: "",
    feedback: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async () => {
    try {
      await contactValidateSchema.validate(formValues, {
        abortEarly: false
      })

      // Clear previous form errors if validation is successful
      setFormErrors({})
      // Open email client when clicked
      const subject = encodeURIComponent(`Contact from ${formValues.name}`)
      const body = encodeURIComponent(formValues.feedback)
      const mailtoLink = `mailto:inquiries@myeki.market?subject=${subject}&body=${body}`
      window.location.href = mailtoLink
      setFormValues({
        name: '',
        feedback: ''
      })
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        // Handle client-side validation errors
        const errors: {[key: string]: string} = {}
        err.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path] = validationError.message
          }
        })
        setFormErrors(errors)
      }
    }
  }
  return (
    <div className="flex flex-col justify-between gap-10 lg:flex-row">
      <div className="w-full">
        <h4 className="flex items-center text-center justify-center lg:justify-start lg:text-left gap-2 text-xs font-bold uppercase tracking-[3px] text-[#0D0D0D]">
          {' '}
          <span className="h-[2px] lg:block hidden w-[20px] bg-[#0D0D0D]" /> Rate our MARKETPLACE
        </h4>
        <h2 className="playfair-display-font mt-4 text-center text-[30px] leading-[56px] lg:w-[60%] lg:text-left lg:text-[40px]">
          Submit your feedback
        </h2>
      </div>
      <div className="w-full rounded-[30px] border border-[#EDEDED] bg-white p-[40px] shadow-f2">
        <form className="flex flex-col gap-5">
          <div className="">
            <TextInput
              name="name"
              onChange={handleInputChange}
              placeholder="Name"
              type="text"
              errorMessage={formErrors.name}
              value={formValues.name}
              className=""
              title={<span className="font-bold text-[#0D0D0D]">Name</span>}
            />
          </div>
          <div className="">
            <TextAreaInput
              name="feedback"
              onChange={handleInputChange}
              row={5}
              placeholder="Let us know what you think."
              errorMessage={formErrors.feedback}
              value={formValues.feedback}
              className=""
              title={(<span className="font-bold text-[#0D0D0D]">Feedback</span>) as any}
            />
          </div>
          <div className="mt-2">
            <CustomButton onClick={handleSubmit} type="button" className="py-4 font-bold text-white shadow-f2">
              Submit
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LandingContactForm
