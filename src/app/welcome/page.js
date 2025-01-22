import Image from "next/image";
import Link from "next/link"; 

import rcmndLogo from '../../../public/rcmndLogo.png'

export default function Welcome() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#110A02]">
      <Image src={rcmndLogo} alt='rcmnd logo' height={20} width={80}m className='pb-10' />
      <div className="my-2">
        <Link href="/sign-in">
          <button className="w-64 border border-[#FBF8F4] bg-[#110A02] text-[#FBF8F4] hover:bg-[#513C2C] py-2 px-4 duration-500">
            sign in
          </button>
        </Link>
      </div>
      <div>
        <Link href="/sign-up">
          <button className="w-64 border border-[#FBF8F4] bg-[#110A02] text-[#FBF8F4] hover:bg-[#513C2C] py-2 px-4 duration-500">
            sign up
          </button>
        </Link>
      </div>
    </div>
  );
}
