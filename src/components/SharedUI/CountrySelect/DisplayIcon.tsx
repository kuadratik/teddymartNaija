import {US, NG, CA, EU, AU, GB} from 'country-flag-icons/react/3x2'

const DisplayIcon = (value: string, props: any) => {
  switch (value) {
    case 'USD':
      return <US {...props} />
    case 'CAD':
      return <CA {...props} />
    case 'NGN':
      return <NG {...props} />
    // add Case for GBP, EUR and AUD
    case 'GBP':
      return <GB {...props} />
    case 'EUR':
      return <EU {...props} />
    case 'AUD':
      return <AU {...props} />

    default:
      return <US {...props} />
  }
}

export default DisplayIcon
