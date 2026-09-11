import {ILanguageList} from '@/components/SharedUI/CountrySelect/CountrySelect'
import dayjs from 'dayjs'

// Capitalize first letter of each word in a string
export const capitalizeFirstLetter = (string: string) => {
  return string ? string?.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()) : ''
}

// Extract the first 8 characters of the original string and append "..." to the end
export const shortenString = (originalString: string, length = 8) => {
  if (originalString?.length <= length) return originalString
  const shortened = `${originalString?.substring(0, length)}...`
  return shortened
}

// Remove both the brackets, +, dash, dot, and the spaces from the phone number e.g "(207) 571-9309-44" to "207571930944"
export const cleanPhoneNumber = (phoneNumber: any) => {
  if (!phoneNumber) return null
  return phoneNumber?.replace(/[()\s\-+.]/g, '')
}

// export const getCountryCode = (phoneNumber: string) => {
//   if (!phoneNumber) return null;
//   const parsedNumber = parsePhoneNumber(phoneNumber);
//   return parsedNumber?.countryCallingCode ?? '';
// };

export const getCountryCode = (phoneNumber: string): string | null => {
  if (!phoneNumber) {
    return null
  }

  try {
    const countryCodeMatch = phoneNumber.match(/^\D*(\d+)/)

    return countryCodeMatch ? countryCodeMatch[1] : null
  } catch {
    return null
  }
}

// Returns the current date in the format "YYYY-MM-DD"
export const getCurrentDate = () => {
  const currentDate = new Date() // Create a new Date object with the current date
  const year = currentDate.getFullYear() // Get the current year from the Date object
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Get the current month from the Date object, add 1 to it since the getMonth() method returns a zero-based index, convert it to a string, and pad it with a leading zero if it has only one digit
  const day = currentDate.getDate().toString().padStart(2, '0') // Get the current day of the month from the Date object, convert it to a string, and pad it with a leading zero if it has only one digit
  const formattedDate = `${year}-${month}-${day}` // Combine the year, month, and day strings into the desired format using a template literal

  return formattedDate // Return the formatted date string
}

export const getCurrentDateMinusOneYear = () => {
  const currentDate = new Date() // Create a new Date object with the current date
  const year = currentDate.getFullYear() - 1 // Minus 1 year to the current year
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Get the current month and format it
  const day = currentDate.getDate().toString().padStart(2, '0') // Get the current day of the month and format it
  const formattedDate = `${year}-${month}-${day}` // Combine the year, month, and day strings into the desired format

  return formattedDate // Return the formatted date string
}

export const getCurrentDateAddFiveYears = () => {
  const currentDate = new Date() // Create a new Date object with the current date
  const year = currentDate.getFullYear() + 1 // Add 1 year to the current year
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Get the current month and format it
  const day = currentDate.getDate().toString().padStart(2, '0') // Get the current day of the month and format it
  const formattedDate = `${year}-${month}-${day}` // Combine the year, month, and day strings into the desired format

  return formattedDate // Return the formatted date string
}

// Returns the current date in the format "YYYY-MM"
export const getMonthYear = (date?: Date) => {
  const defaultDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  if (!date) date = defaultDate
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

// Returns the current date in the format "DD/MM/YYYY"
export const formatCurrentDate = () => {
  let today = new Date()
  let day = today.getDate().toString().padStart(2, '0')
  let month = (today.getMonth() + 1).toString().padStart(2, '0') // add 1 to the month because it's zero-indexed
  let year = today.getFullYear().toString()

  let formattedDate = `${day}/${month}/${year}`
  return formattedDate // Return the formatted date string
}

// Takes a grade string and returns a corresponding color in hexadecimal format.
export const gradeBgColor = (grade: string) => {
  switch (grade) {
    case '1':
      return '#FFC700'
    case '2':
      return '#FF3D57'
    case '3':
      return '#0081FF'
    case '4':
      return '#008124'
    case '5':
      return '#561F37'
    default:
      return '#ED7D3A'
  }
}

// Takes a grade string and returns a corresponding color in hexadecimal format.
export const gradeColor = (grade: string) => {
  switch (grade) {
    case '1':
      return '#000000'
    default:
      return '#fff'
  }
}

// Generates and returns a random color in RGB format
export const generateColor = () => {
  const red = Math.floor(Math.random() * 256)
  const green = Math.floor(Math.random() * 256)
  const blue = Math.floor(Math.random() * 256)
  return `rgb(${red}, ${green}, ${blue})`
}

export const formatDate = (date: Date) => {
  const day = date.toLocaleDateString('en-US', {day: '2-digit'})
  const month = date.toLocaleDateString('en-US', {month: '2-digit'})
  const year = date.toLocaleDateString('en-US', {year: 'numeric'})
  return `${day}.${month}.${year}`
}

export const formatDate2 = (date: Date) => {
  const day = date.toLocaleDateString('en-US', {day: '2-digit'})
  const month = date.toLocaleDateString('en-US', {month: '2-digit'})
  const year = date.toLocaleDateString('en-US', {year: 'numeric'})
  return `${year}-${month}-${day}`
}

export function formattedDateString(isoDateString: string) {
  const date = new Date(isoDateString)
  const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
  return formattedDate
}

export const formatDateByShort = (dateString: string) => {
  const date = new Date(dateString)

  const day = date.getDate() // Get day of the month
  const month = date.toLocaleString('default', {month: 'short'}) // Get abbreviated month
  const year = date.getFullYear() // Get year

  return `${day} ${month}, ${year}`
}

export function formatQuantity(quantity: number): string {
  if (quantity >= 0 && quantity <= 9) {
    return quantity?.toString().padStart(2, '0') // Adds a leading zero for 0-9
  }
  return quantity?.toString() // Returns as-is for 10 and above
}
// Example usage

// calculate the length of days from the given date range
export const getDateRange = (startDate_: string, endDate_: string) => {
  if (!startDate_ || !endDate_) return '0 days'

  const startDate = new Date(startDate_)
  const endDate = new Date(endDate_)

  // Calculate the difference in milliseconds between the start and end date
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime())

  // Convert the difference to days
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return `${daysDiff} days`
}

// extract the subdomain
export const getSubdomain = (url: string) => {
  let hostname

  // Find and remove protocol if present
  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  // Find and remove www if present
  if (hostname.indexOf('www.') === 0) {
    hostname = hostname.slice(4)
  }

  // Get the subdomain
  var subdomain = hostname.split('.')[0]

  return subdomain
}

export const updateRouteParams = (newParams: any, router: any) => {
  // Get the current query parameters
  const currentParams = router.query

  // Merge current params with new params
  const updatedParams = {...currentParams, ...newParams}

  // Update the route with the new parameters
  router.push({
    pathname: router.pathname, // keeps the current path
    query: updatedParams // updates the query with new params
  })
}

export const getDefaultDate = () => {
  const dates = [new Date(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), new Date(new Date())]

  const formattedDate = dates.map(date => {
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  })

  return {
    start: formattedDate[0],
    end: formattedDate[1]
  }
}

export const formatDateWithSlash = (inputDate: string) => {
  const date = new Date(inputDate)

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()

  const formattedDate = `${day}/${month}/${year}`

  return formattedDate
}

export const sliceText = (text: string, maxLength: number) => {
  if (text?.length <= maxLength) {
    return text
  } else {
    return text?.slice(0, maxLength) + '...'
  }
}

export const capitalizeOnlyFirstLetter = (str: string) => {
  // Check if the string is empty or undefined
  if (!str || str.trim() === '') {
    return '' // Return an empty string if input is invalid
  }

  // Access the first character and convert it to uppercase
  const firstLetter = str[0].toUpperCase()

  // Slice the rest of the string (excluding the first character)
  const remainingString = str.slice(1)

  // Combine the uppercase first letter and the lowercase remaining string
  return firstLetter + remainingString.toLowerCase()
}

export const formatDateWithWeekday = (dateString: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const date = new Date(dateString)
  const day = date.toLocaleString('en-US', {weekday: 'short'})
  const month = months[date.getMonth()]
  const dayOfMonth = date.getDate()

  return `${day} ${month} ${dayOfMonth}`
}
export const formatDateWithDayAndMonth = (dateString: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const date = new Date(dateString)
  const day = date.toLocaleString('en-US', {weekday: 'short'})
  const month = months[date.getMonth()]
  const dayOfMonth = date.getDate()

  return `${dayOfMonth} ${month}, `
}

export function formatPhoneNumberWithCountryCode(countryCode: any, phoneNumber: string | number) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `${countryCode} (' + match[1] + ') ` + match[2] + '-' + match[3]
  }
  return null
}
export const segregateGradesByYearGroup = (grades: any) => {
  return grades?.reduce((result: any, grade: any) => {
    const yearGroup = grade?.year_group
    if (!result[yearGroup]) {
      result[yearGroup] = []
    }
    result[yearGroup].push(grade)
    return result
  }, {})
}

// Parse and format the date
export const formattedDate = (date: string) => dayjs(date).format('dddd DD MMM, YYYY')

export const formattedTime = (time: string) => dayjs(time, 'HH:mm:ss').format('hh : mmA')

export function capitalizeEachWord(sentence: string) {
  return sentence
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getFileNameFromPath = (path: string) => {
  return path.split('/').pop()
}

export const Uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.trunc(Math.random() * 16)
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea', {})
  textArea.style.display = 'none'
  textArea.value = text

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    return msg === 'successful' ? Promise.resolve() : Promise.reject()
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
    return Promise.reject(err)
  } finally {
    document.body.removeChild(textArea)
  }
}

export default function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    return fallbackCopyTextToClipboard(text)
  }
}

export const getCurrencySign = (value: string): string => {
  const languageList: ILanguageList[] = [
    {key: 'us', value: 'USD', name: 'United States', currencySign: '$'},
    {key: 'ca', value: 'CAD', name: 'Canada', currencySign: '$'},
    {key: 'ng', value: 'NGN', name: 'Nigeria', currencySign: '₦'},
    {key: 'gb', value: 'GBP', name: 'United Kingdom', currencySign: '£'},
    {key: 'eu', value: 'EUR', name: 'Europe', currencySign: '€'},
    {key: 'au', value: 'AUD', name: 'Australia', currencySign: '$'}
  ]

  const currency = languageList.find(item => item.value === value)
  return currency?.currencySign || '$' // Return found currencySign or fallback to '$'
}

export function extractHashCode(input: string) {
  // Use a regular expression to match the pattern
  const match = input.match(/-([a-f0-9]{4})-/)
  return match ? `#${match[1]}` : null
}

export const formatWithCommas = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '') // Remove non-numeric characters
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas
}

export const removeLastWord = (text: string) => {
  const textArr = text.split(' ')
  textArr.pop()
  return textArr.join(' ')
}

export const getLastWord = (text: string) => {
  const textArr = text.split(' ')
  return textArr[textArr.length - 1]
}
export function formatDate3(dateStr: string | number | Date) {
  const date = new Date(dateStr)
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  // @ts-ignore
  return date.toLocaleString('en-US', options)
}

export const amountFormatter = (amount: number) => {
  if (amount === undefined || amount === null) return '0.00'
  const newAmount = amount.toString().split('.')
  const newAmount1 = newAmount[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const newAmount2 = newAmount[1] ? (newAmount[1].length === 1 ? `.${newAmount[1]}0` : `.${newAmount[1]}`) : ''
  return `${newAmount1}${newAmount2}`
}
