import Image from 'next/image'

const PageLoader = () => {
  return (
    <div className="fixed z-[9999] flex h-screen w-full items-center justify-center bg-[#fff]">
      <Image className="loading_state" src={'/assets/teddy_loader.svg'} width={225} height={90} alt="logo" />
    </div>
  )
}

export default PageLoader
