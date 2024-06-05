"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaRegCircleUp } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import Image from "next/image";

const Dropzone = (props) => {
  const router = useRouter();
  // const [rejected, setRejected] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    image: "",
  });

  const [files, setFile] = useState();
  const [isImageDropped, setIsImageDropped] = useState(true);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop: (acceptedFiles) => {
      setIsImageDropped(false);
      setFormData({ ...formData, image: acceptedFiles });
      console.log(acceptedFiles);
      setFile(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files?.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    router.replace("/homeFeed");
  };

  const preview = files?.map((file) => (
    <div key={file.name} className="flex justify-center items-center h-screen">
      <Image
        src={file.preview}
        alt={file.name}
        className="object-contain rounded-md"
        width={350}
        height={400}
        // Revoke data uri after image is loaded
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));

  return (
    <div className="h-screen w-full bg-[#110A02]">
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-2 h-full jusify-center items-center"
      >
        {isImageDropped ? (
          <div
            className="flex flex-col items-center justify-center gap-4 mx-auto h-1/2 w-2/3 bg-[#513C2C] border-dashed border-2 border-[#ECE2D8]"
            {...getRootProps()}
          >
            <input
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              name="image"
              type="file"
              {...getInputProps()}
            />
            <FaRegCircleUp className="w-5 h-5 fill-current" />
            <p>drag and drop images here...</p>
          </div>
        ) : (
          <div>{preview}</div>
        )}
        <div className="flex flex-col mx-auto w-full items-center px-5">
          <input
            value={formData.title}
            type="text"
            name="title"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="title"
            className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-2 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C] w-full"
          />

          <input
            value={formData.link}
            type="text"
            name="link"
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="link"
            className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C] w-full"
          />
          <textarea
            value={formData.description}
            type="text"
            name="description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="description"
            className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] mt-2 px-2 py-1 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C] w-full"
          />
          <button
            type="submit"
            className="w-1/2 mt-2 bg-[#ECE2D8] hover:bg-[#513C2C] text-[#110A02] font-bold py-2 px-4 rounded-md duration-500 "
          >
            create
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dropzone;
