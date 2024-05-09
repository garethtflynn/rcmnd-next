import Link from "next/link";

export default function Login() {
  return (
    <div className="w-full h-screen bg-[#110A02] flex flex-col justify-center items-center text-[#FBF8F4]">
      <h1>login</h1>
      <form className="flex gap-2 flex-col">
        <input
          type="text"
          name="email"
          placeholder="email"
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C]"
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C]"
        />
        <div className="flex gap-2 justify-center">
          <Link
            href="/homeFeed"
            className="text-[#FBF8F4] px-2 py-1 rounded"
          >
            <button className="w-64 bg-[#ECE2D8] hover:bg-[#513C2C] text-[#110A02] font-bold py-2 px-4 rounded-md duration-500">
              login
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
