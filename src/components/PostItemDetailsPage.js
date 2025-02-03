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
      className="h-screen w-full bg-[#110A02] place-content-center place-items-center px-1 text-[#FBF8F4] md:grid md:grid-cols-2"
    >
      <div className="place-items-center overflow-hidden md:py-1">
        <Image
          className="w-1/2 md:w-3/4 2xl:w-10/12 h-full object-contain"
          src={image}
          alt={title}
          width="300"
          height="300"
        />
      </div>
      <div className="w-full h-fit place-content-center sm:px-4 py-4 md:w-3/4 md:px-0 md:pt-0 text-[#FBF8F4]">
        <h1 className="text-xl py-4">NOTES</h1>
        <div className="border p-2 mx-1 bg-[#4C4138]">
          <p>{title}</p>
          <br />
          <Link href={link} target="_blank">
            <p className="hover:opacity-50 underline underline-offset-2">
              link
            </p>
          </Link>
          <br />
          <p className="italic">{description}</p>
        </div>
      </div>
    </div>
  );
}
