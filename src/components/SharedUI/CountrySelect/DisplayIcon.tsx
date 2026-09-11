import {US, NG, CA} from 'country-flag-icons/react/3x2'

const DisplayIcon = (value: string, props: any) => {
  switch (value) {
    case 'USD':
      return <US {...props} />
    case 'CAD':
      return <CA {...props} />
    case 'NGN':
      return <NG {...props} />

    default:
      return <US {...props} />
  }
}

export default DisplayIcon
