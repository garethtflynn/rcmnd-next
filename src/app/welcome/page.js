import Image from "next/image";
import Link from "next/link";

import rcmndLogo from "../../../public/rcmndLogo.png";

export default function Welcome() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#000000]">
      <Image
        src={rcmndLogo}
        alt="rcmnd logo"
        height={20}
        width={80}
        className="pb-10"
      />
      <div className="my-2">
        <Link href="/sign-in">
          <button className="w-64 border border-[#D7CDBF] bg-[#000000] text-[#D7CDBF] hover:bg-[#4C4138] py-2 px-4 duration-500">
            sign in
          </button>
        </Link>
      </div>
      <div>
        <Link href="/sign-up">
          <button className="w-64 border border-[#D7CDBF] bg-[#000000] text-[#D7CDBF] hover:bg-[#4C4138] py-2 px-4 duration-500">
            sign up
          </button>
        </Link>
      </div>
    </div>
  );
}
