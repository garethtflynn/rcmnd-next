"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaRegCircleUp } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import Image from "next/image";

const Dropzone = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    image: "",
    listId: "",
  });
  const [image, setImage] = useState();
  const [lists, setLists] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const [isImageDropped, setIsImageDropped] = useState(true);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop: (acceptedFiles) => {
      // console.log("ON DROP ACCEPTED FILE", acceptedFiles);
      const file = acceptedFiles[0];
      // console.log(file.name);
      const fileAsString = JSON.stringify(acceptedFiles); // Convert array to JSON string
      setIsImageDropped(false);
      setFormData({ ...formData, image: fileAsString }); // need to change image in formData
      setImage(
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
    return () => image?.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [image]);

  const uploadImageToB2 = async () => {
    const imageFile = image[0];
    const key = imageFile.name;
    // const key = imageName;
    // Tell B2 to set the content type automatically depending on the file extension
    const contentType = "b2/x-auto";
    let msg, detail;

    try {
      // Ask the backend for a presigned URL
      let response = await fetch(
        "/api/upload?" +
          new URLSearchParams({
            key: key,
          }).toString()
      ); // Just sending the image name as key
      // console.log("RESPONSE VARIABLE:", response);
      // Report on the outcome
      if (!response.ok) {
        msg = `${response.status} when retrieving presigned URL from backend`;
        // console.error(msg);
        detail = await response.text();
      } else {
        const { presignedUrl } = await response.json();
        // console.log(`Presigned URL: ${presignedUrl}`);

        // Get the file's contents as an ArrayBuffer
        const fileContent = await imageFile.arrayBuffer();
        // console.log(`File content after arrayBuffer: ${fileContent}`);

        // Upload the file content with the filename, hash and auth token
        response = await fetch(presignedUrl, {
          method: "PUT",
          mode: "cors",
          body: fileContent,
          headers: {
            "Content-Type": contentType,
            Accept:
              "image/avif,image/webp,image/apng,image/svg+xml,image/jpeg,image/*,*/*;q=0.8",
          },
        });

        // Report on the outcome
        if (response.status >= 200 && response.status < 300) {
          msg = `${response.status} response from S3 API. Success!`;
        } else if (response.status >= 400) {
          msg = `${response.status} error from S3 API.`;
        } else {
          msg = `Unknown error.`;
        }

        detail = "[S3 PutObject does not return any content]";
      }
    } catch (error) {
      console.error("Fetch threw an error:", error);
      msg = `Fetch threw "${error}" - see the console and/or network tab for more details`;
      detail = error.stack;
    }

    // console.log(`Upload file result: ${msg}`);
    // console.log(`Response detail: ${detail}`);
  };

  const createPost = async () => {
    // console.log("CREATE POST FUNCTION");
    const imageFile = image[0];
    const imageName = imageFile.name;
    const userId = session?.user?.id;
    if (!userId) {
      console.error("User ID is required.");
      alert("You must be logged in to create a post!");
      return;
    }
    // Ensure formData has required properties
    if (!formData.title || !formData.link || !formData.image) {
      // console.log(formData);
      alert("Form input required!");
      return;
    }

    try {
      const imageReferenceUrl = process.env.NEXT_PUBLIC_DATABASE_IMAGE_URL;
      // const endpointUrl = process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL;
      // Include userId in the body
      const body = {
        ...formData, // Spread existing form data
        image: `${imageReferenceUrl}/${imageName}`,
        userId: userId, // Add userId to the body
      };
      // console.log(body);
      const apiUrl = "/api/post";
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      // console.log("REQ DATA", requestData);
      const response = await fetch(apiUrl, requestData);

      if (!response.ok) {
        throw new Error(
          `Failed to create post: ${response.status} - ${response.statusText}`
        );
      }
      setFormData(""); // Reset the form after successful submission
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchLists = async () => {
        try {
          const res = await fetch(`/api/lists/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!res.ok) {
            // console.log("RES IN userTest", res);
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
          // console.log(data);
          setLists(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [userId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    uploadImageToB2();
    createPost();
    router.replace("/profilePage");
  };

  const preview = image?.map((file) => (
    <div key={file.name} className="flex justify-center items-center">
      <Image
        src={file.preview}
        alt={file.name}
        className="object-fit"
        width={350}
        height={200}
        // Revoke data uri after image is loaded
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));

  return (
    <form
      onSubmit={onSubmit}
      className="h-screen w-full bg-[#110A02] flex flex-col jusify-center place-content-center py-2"
    >
      {isImageDropped ? (
        <div
          className="h-96 w-3/4 md:h-1/2 md:w-1/2 lg:h-1/2 lg:w-1/2  mx-auto bg-[#4C4138] border-dashed border-2 border-[#ECE2D8] flex flex-col jusify-center items-center place-content-center"
          {...getRootProps()}
        >
          <input
            defaultValue={formData.image}
            name="image"
            type="file"
            accept="image/*"
            {...getInputProps()}
          />
          <FaRegCircleUp className="w-5 h-5 fill-current" />
          <p className="px-3 text-center">drag and drop images here</p>
        </div>
      ) : (
        <div className="h-full w-1/2 md:h-full md:w-full mx-auto">
          {preview}
        </div>
      )}
      <div className="flex flex-col mx-auto w-10/12	items-center px-5 pt-5">
        <input
          defaultValue={formData.title}
          type="text"
          name="title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="title"
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-2 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138] w-full"
        />
        <input
          defaultValue={formData.link}
          type="text"
          name="link"
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="link"
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138] w-full"
        />
        <textarea
          defaultValue={formData.description}
          type="text"
          name="description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          placeholder="description"
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] mt-2 px-2 py-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138]  w-full"
        />
        <select
          className="border border-[#ECE2D8] bg-transparent text-[#4C4138] mt-2 px-2 py-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none w-full"
          onChange={(e) => setFormData({ ...formData, listId: e.target.value })}
        >
          <option>list</option>
          {lists?.map((list) => {
            return (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            );
          })}
        </select>
        <button
          type="submit"
          className="w-1/2 mt-2 bg-[#ECE2D8] hover:opacity-75 text-[#110A02] font-bold py-2 px-4 rounded-md duration-500 "
        >
          create
        </button>
      </div>
    </form>
  );
};

export default Dropzone;
