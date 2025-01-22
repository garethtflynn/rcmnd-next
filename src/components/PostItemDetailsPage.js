"use client";
import Image from "next/image";
import Link from "next/link";




export default function PostItemDetailsPage({
  id,
  title,
  link,
  description,
  image,
  deletePostCallback,
}) {


  return (
    <div
      id={id}
      className="h-screen w-full bg-[#110A02] place-content-center px-1 text-white md:grid md:grid-cols-2"
    >
      <div className="place-items-center">
        <Image
          className="w-fit h-full object-contain"
          src={image}
          alt={title}
          width="300"
          height="300"
        />
      </div>
      <div className="place-content-center w-full sm:px-4 pt-4 md:w-3/4 md:px-0 md:pt-0">
        <h1 className="place-self-center text-2xl">notes</h1>
        <div className="border p-2 mx-1 ">
          <p className="text-lg">{title}</p>
          <br />
          <Link href={link} target="_blank">
            <p className="hover:opacity-50">Link</p>
          </Link>
          <br />
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
