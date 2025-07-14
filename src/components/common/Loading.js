import React from "react";
import Image from "next/image";

import rcmndLogo from "../../../public/rcmndLogo.png";

function Loading(props) {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#000000]">
      <Image
        src={rcmndLogo}
        alt="rcmnd"
        width={50}
        height={40}
        className="w-6 sm:w-8 md:w-9 lg:w-10 xl:w-11 h-auto"
        style={{ maxWidth: "none" }}
      />
    </div>
  );
}

export default Loading;
