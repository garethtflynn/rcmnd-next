import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";

const posts = [
  {
    id: 1,
    title: "watch",
    link: "https://seikousa.com/collections/essentials/products/swr083",
    image: require("../../../public/watch.webp"),
  },
  {
    id: 2,
    title: "dunks",
    link: "https://www.nike.com/t/dunk-low-lx-womens-shoes-16c9ld/FJ2260-002?_gl=1*2mpjut*_up*MQ..&gclid=CjwKCAiAivGuBhBEEiwAWiFmYdfayo8dPt5MoOghkXezIrkyF_9TLFizl_p0fuhtlp92CMQrOYyFkxoCdsYQAvD_BwE&gclsrc=aw.ds",
    image: require("../../../public/nikeDunks.png"),
  },
  {
    id: 3,
    title: "hat",
    link: "https://www.culturekings.com/products/new-era-new-york-yankees-dark-green-cord-9forty-a-frame-snapback-dark-green",
    image: require("../../../public/hat.webp"),
  },
  {
    id: 4,
    title: "restaurant",
    link: "https://longroaddistillers.com/",
    image: require("../../../public/restaurant.jpeg"),
  },
];

export default function HomeFeed({ props }) {
  return (
    <div>
      <Header />
      <div className="h-full w-full py-1 px-4 grid grid-cols-3 bg-[#110A02] text-[#FBF8F4]">
        {posts.map((posts, key) => {
          return (
            <div key={key} className="p-3">
              <Image
                className="w-full h-96 object-cover rounded"
                src={posts.image}
                alt={posts.title}
              />
              <p className="text-[#FBF8F4] text-base py-2">{posts.title}</p>
              <Link href={posts.link} target="_blank">
                <span className="rounded-full py-1 text-sm font-semibold text-gray-700">
                  link
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
