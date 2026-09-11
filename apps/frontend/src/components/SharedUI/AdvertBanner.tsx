interface IProps {}

interface IProps {
  className: string
}
const AdvertBanner = ({className}: IProps) => {
  return <div className={`${className}`}></div>
}

export default AdvertBanner
