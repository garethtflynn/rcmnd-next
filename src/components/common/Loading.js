import React from "react";
import Image from "next/image";
import rcmndLogo from "../../../public/rcmndLogo.png";

function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#000000]">
      <div className="animate-pulse-grow">
        <Image
          src={rcmndLogo}
          alt="rcmnd"
          width={80}
          height={80}
          className="w-10 sm:w-12 md:w-14 lg:w-16 xl:w-20 h-auto"
          style={{ maxWidth: "none" }}
        />
      </div>
    </div>
  );
}

export default Loading;
