import Image from "next/image";
import React from "react";

const PageLoader = () => {
  return (
    <div className="h-screen fixed z-[9999] bg-[#fff] w-full flex justify-center items-center">
      <Image
        className="loading_state"
        src={"/assets/logo.svg"}
        width={225}
        height={90}
        alt="logo"
      />
    </div>
  );
};

export default PageLoader;
