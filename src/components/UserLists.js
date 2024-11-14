import React from "react";
import PostItem from "./PostItem";

const lists = [
  {
    id: 2,
    title: "dunks",
    link: "https://www.nike.com/t/dunk-low-lx-womens-shoes-16c9ld/FJ2260-002?_gl=1*2mpjut*_up*MQ..&gclid=CjwKCAiAivGuBhBEEiwAWiFmYdfayo8dPt5MoOghkXezIrkyF_9TLFizl_p0fuhtlp92CMQrOYyFkxoCdsYQAvD_BwE&gclsrc=aw.ds",
    image: require("../../public/nikeDunks.png"),
  },
  {
    id: 1,
    title: "watch",
    link: "https://seikousa.com/collections/essentials/products/swr083",
    image: require("../../public/watch.webp"),
  },
  {
    id: 4,
    title: "restaurant",
    link: "https://longroaddistillers.com/",
    image: require("../../public/restaurant.jpeg"),
  },
  {
    id: 5,
    title: "hat",
    link: "https://www.culturekings.com/products/new-era-new-york-yankees-dark-green-cord-9forty-a-frame-snapback-dark-green",
    image: require("../../public/hat.webp"),
  },
  {
    id: 6,
    title: "restaurant",
    link: "https://longroaddistillers.com/",
    image: require("../../public/restaurant.jpeg"),
  },
  {
    id: 3,
    title: "hat",
    link: "https://www.culturekings.com/products/new-era-new-york-yankees-dark-green-cord-9forty-a-frame-snapback-dark-green",
    image: require("../../public/hat.webp"),
  },
];

function UserLists(props) {
  return (
    <div className="h-full w-full py-1 px-4 grid grid-cols-3 bg-[#110A02] text-[#FBF8F4]">
      {lists.map((post) => {
        return (
          <PostItem
            key={post.id}
            title={post.title}
            href={post.link}
            src={post.image}
            alt={post.title}
            {...post}
          />
        );
      })}
    </div>
  );
}

export default UserLists;
