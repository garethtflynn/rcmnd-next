import { FaPlus, FaAngleDown } from "react-icons/fa6";

export default function Header() {
  return (
    <nav class="flex items-center flex-wrap bg-[#110A02] p-4">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <a href="/homeFeed" class="font-semibold text-xl tracking-tight">
          rcmnd
        </a>
        <input
          type="text"
          name="email"
          placeholder="search"
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 ml-4 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C]"
        />
      </div>
      <div class="w-full block flex-grow lg:flex lg:flex-end lg:items-center lg:w-auto">
        <div class="w-full text-sm flex items-center justify-end">
          <a
            href="/homeFeed"
            class="block mt-4 lg:inline-block lg:mt-0 text-[#FBF8F4] hover:text-white mr-4"
          >
            home
          </a>
          <a
            href="/profile"
            class="block mt-4 lg:inline-block lg:mt-0 text-[#FBF8F4] hover:text-white mr-4"
          >
            profile
          </a>
          <a
            href="/notifications"
            class="block mt-4 lg:inline-block lg:mt-0 text-[#FBF8F4] hover:text-white mr-2"
          >
            notifications
          </a>
          <a href="/createPost">
            <FaPlus
              style={{ color: "#FBF8F4", fontSize: "1.5em" }}
              className="ml-4 mr-3"
            />
          </a>
          <a
            href="/account"
            class="lg:inline-block lg:mt-0 text-[#FBF8F4] hover:text-white "
          >
            <FaAngleDown style={{ color: "#FBF8F4", fontSize: "1.5em" }} />
          </a>
        </div>
      </div>
    </nav>
  );
}
