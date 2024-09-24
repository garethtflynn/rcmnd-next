import Link from "next/link"; 

export default function Welcome() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#110A02]">
      <div>
        <h1 className="text-[#FBF8F4]">welcome to rcmnd</h1>
      </div>
      <div className="my-2">
        <Link href="/sign-in">
          <button className="w-64 bg-[#ECE2D8] hover:bg-[#513C2C] text-[#110A02] font-bold py-2 px-4 rounded duration-500">
            sign in
          </button>
        </Link>
      </div>
      <div>
        <Link href="/sign-up">
          <button className="w-64 bg-[#ECE2D8] hover:bg-[#513C2C] text-[#110A02] font-bold py-2 px-4 rounded duration-500">
            sign up
          </button>
        </Link>
      </div>
    </div>
  );
}
