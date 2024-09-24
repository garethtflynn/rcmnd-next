import Image from "next/image";
import Link from "next/link";

export default function PostItem({ id, title, link, description, image }) {

  
  return (
    <div id={id} className="p-3">
      <Image
        className="w-full h-96 object-cover rounded"
        src={image}
        alt={title}
      />
      <p className="text-[#FBF8F4] text-base py-2">{title}</p>
      <Link href={link} target="_blank">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          link
        </span>
      </Link>
    </div>
  );
}
