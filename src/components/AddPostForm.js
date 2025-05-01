"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaRegCircleUp, FaXmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Field, Label, Switch } from "@headlessui/react";

const AddPostForm = ({ isOpen, closeModal, listId, listTitle }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    image: "",
    listId: listId,
    isPrivate: false,
  });
  const [image, setImage] = useState(null);
  const [lists, setLists] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isImageDropped, setIsImageDropped] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);
  const [conversionError, setConversionError] = useState(null);

  // Set isBrowser to true once the component mounts
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const processFile = async (file) => {
    // Check if the file is a HEIC/HEIF file
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
      setIsConverting(true);
      setConversionError(null);

      try {
        // Import heic2any dynamically only when needed
        const heic2any = await import("heic2any").then(
          (module) => module.default
        );

        // Convert HEIC to JPEG
        const jpegBlobResult = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });

        // heic2any can return array or single blob
        const jpegBlob = Array.isArray(jpegBlobResult)
          ? jpegBlobResult[0]
          : jpegBlobResult;

        // Create a new File object for the converted image
        const convertedFile = new File(
          [jpegBlob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );

        return convertedFile;
      } catch (error) {
        console.error("Error converting HEIC file:", error);
        setConversionError(
          "Failed to convert HEIC image. Please try another file format."
        );
        return null;
      } finally {
        setIsConverting(false);
      }
    } else {
      // Return the original file if it's not HEIC
      return file;
    }
  };

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 10485760, // 10MB limit
    onDrop: async (acceptedFiles) => {
      // Only run browser-specific code after component is mounted
      if (!isBrowser || acceptedFiles.length === 0) return;

      setIsConverting(true);

      try {
        const file = acceptedFiles[0];
        const processedFile = await processFile(file);

        if (!processedFile) {
          // If processing failed, stop here
          return;
        }

        // Create a preview URL
        const preview = URL.createObjectURL(processedFile);

        // Update component state with the processed file
        const processedFileWithPreview = Object.assign(processedFile, {
          preview: preview,
        });

        setIsImageDropped(false);
        setFormData({ ...formData, image: processedFile });
        setImage([processedFileWithPreview]);
      } catch (error) {
        console.error("Error processing file:", error);
        setConversionError("Error processing image. Please try again.");
      } finally {
        setIsConverting(false);
      }
    },
    onError: (err) => {
      console.error("Dropzone error:", err);
      setConversionError("Error with file upload. Please try again.");
    },
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    if (isBrowser && image) {
      return () =>
        image.forEach((file) => {
          if (file.preview) URL.revokeObjectURL(file.preview);
        });
    }
  }, [image, isBrowser]);

  // Process image with Sharp and upload to B2 in one step
  const processAndUploadImage = async () => {
    if (!isBrowser || !image || !image[0]) return null;

    setIsUploading(true);
    setConversionError(null);

    try {
      const imageFile = image[0];
      
      // Create a FormData object to send the image to our API
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Send to our single API endpoint that handles processing and uploading
      const response = await fetch('/api/upload-with-processing', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process and upload image');
      }

      // Get the processed image URL
      const result = await response.json();
      return result.url; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Process and upload error:', error);
      setConversionError(`Failed to process and upload image: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const createPost = async (imageUrl) => {
    if (!userId) {
      console.error("User ID is required.");
      setConversionError("You must be logged in to create a post!");
      return false;
    }
    
    // Ensure formData has required properties
    if (!formData.title || !formData.link || !imageUrl) {
      setConversionError("Title, link and image are required!");
      return false;
    }

    try {
      const body = {
        ...formData,
        image: imageUrl,
        userId: userId,
      };
      
      const apiUrl = "/api/post";
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(apiUrl, requestData);

      if (!response.ok) {
        throw new Error(
          `Failed to create post: ${response.status} - ${response.statusText}`
        );
      }
      return true;
    } catch (error) {
      console.error("Post creation error:", error);
      setConversionError(`Failed to create post: ${error.message}`);
      return false;
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
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
          setLists(data);
        } catch (err) {
          console.error(err.message);
          // Use proper error handling
          setConversionError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [userId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setConversionError(null);

    // Process and upload the image to B2 using our Sharp backend
    const imageUrl = await processAndUploadImage();
    if (!imageUrl) {
      return; // Stop if upload failed
    }

    // Then create the post in your database with the processed image URL
    const postSuccess = await createPost(imageUrl);
    if (!postSuccess) {
      return; // Stop if post creation failed
    }

    // If everything succeeded, close modal and refresh
    closeModal();
    router.refresh();
  };

  const removeImage = () => {
    setIsImageDropped(true);
    if (image) {
      // Clean up any previews
      image.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    }
    setImage(null);
    setFormData({
      ...formData,
      image: "",
    });
    setConversionError(null);
  };

  const preview =
    isBrowser && image && Array.isArray(image)
      ? image.map((file) => (
          <div key={file.name} className="w-1/2 flex justify-center relative">
            <div className="relative">
              <button
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1 cursor-pointer"
                type="button"
                onClick={removeImage}
              >
                <FaXmark className="w-5 h-5" color="white" />
              </button>
              <Image
                src={file.preview}
                alt={file.name}
                className="object-cover"
                width={350}
                height={200}
                // Don't revoke immediately as it would make the image disappear
                // We handle cleanup in useEffect
              />
            </div>
          </div>
        ))
      : null;

  const handlePrivateToggle = (checked) => {
    setEnabled(checked);
    // Update the formData when the switch is toggled
    setFormData((prevData) => ({
      ...prevData,
      isPrivate: checked, // Set isPrivate to the value of the switch
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col jusify-center place-content-center bg-opacity-75 z-50 items-center justify-center p-4"
    >
      {isImageDropped ? (
        <div
          className="h-64 w-2/4 mx-auto bg-[#4C4138] border-dashed border-2 border-[#D7CDBF] flex flex-col jusify-center items-center place-content-center"
          {...getRootProps()}
        >
          <input name="image" type="file" {...getInputProps()} />
          {isConverting ? (
            <p className="px-3 text-center">loading...</p>
          ) : (
            <>
              <FaRegCircleUp className="w-5 h-5 fill-current" />
              <p className="px-3 text-center">add image</p>
            </>
          )}
        </div>
      ) : (
        <div className="h-fit w-full flex justify-center overflow-hidden">
          {isConverting ? (
            <p className="px-3 text-center">loading...</p>
          ) : (
            preview
          )}
        </div>
      )}

      {conversionError && (
        <div className="mx-auto w-10/12 mt-2 bg-red-800 bg-opacity-50 text-[#D7CDBF] p-2 rounded">
          {conversionError}
        </div>
      )}

      <div className="flex flex-col mx-auto w-10/12 items-center px-5 pt-2">
        <input
          value={formData.title}
          type="text"
          name="title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="title"
          className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
        />
        <input
          value={formData.link}
          type="text"
          name="link"
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="link"
          className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
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
          className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
        />
        <input
          placeholder={listTitle} // Shows the title in the placeholder
          value={listTitle}
          type="text"
          name="list"
          readOnly
          className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
        />
        <div className="flex my-2 self-start items-center">
          <Field className="flex my-2 text-[#14100E] self-start items-center">
            <Switch
              checked={enabled}
              onChange={handlePrivateToggle}
              className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#D7CDBF]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
            <Label className="pl-2">private</Label>
          </Field>
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={closeModal}
            type="button"
            className="mr-4 text-[#000000] hover:text-[#14100E]"
          >
            cancel
          </button>
          <button
            type="submit"
            className={`w-1/2 ${
              isLoading || isConverting || isUploading ? "bg-[#4C4138]" : "bg-[#14100E]"
            } text-[#D7CDBF] p-2 hover:bg-[#000000] disabled:opacity-50`}
            disabled={isLoading || isConverting || isUploading}
          >
            {isUploading ? "loading..." : isConverting ? "converting..." : isLoading ? "saving..." : "add post"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPostForm;

// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { FaRegCircleUp, FaXmark } from "react-icons/fa6";
// import { useRouter } from "next/navigation";

// import Image from "next/image";

// import { Description, Field, Label, Switch } from "@headlessui/react";
// import { list } from "postcss";

// const AddPostForm = ({ isOpen, closeModal, listId, listTitle }) => {
//   const { data: session } = useSession();
//   const userId = session?.user?.id;
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     title: "",
//     link: "",
//     description: "",
//     image: "",
//     listId: listId,
//     isPrivate: false,
//   });
//   const [image, setImage] = useState();
//   const [lists, setLists] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [enabled, setEnabled] = useState(false);
//   const [isImageDropped, setIsImageDropped] = useState(true);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: {
//       "image/*": [],
//     },
//     onDrop: (acceptedFiles) => {
//       // console.log("ON DROP ACCEPTED FILE", acceptedFiles);
//       // const file = acceptedFiles[0];
//       // console.log(file.name);
//       const fileAsString = JSON.stringify(acceptedFiles); // Convert array to JSON string
//       setIsImageDropped(false);
//       setFormData({ ...formData, image: fileAsString }); // need to change image in formData
//       setImage(
//         acceptedFiles.map((file) =>
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//           })
//         )
//       );
//     },
//   });

//   useEffect(() => {
//     // Revoke the data uris to avoid memory leaks
//     return () => image?.forEach((file) => URL.revokeObjectURL(file.preview));
//   }, [image]);

//   const uploadImageToB2 = async () => {
//     const imageFile = image[0];
//     const key = imageFile.name;
//     // const key = imageName;
//     // Tell B2 to set the content type automatically depending on the file extension
//     const contentType = "b2/x-auto";
//     let msg, detail;

//     try {
//       // Ask the backend for a presigned URL
//       let response = await fetch(
//         "/api/upload?" +
//           new URLSearchParams({
//             key: key,
//           }).toString()
//       ); // Just sending the image name as key
//       // console.log("RESPONSE VARIABLE:", response);
//       // Report on the outcome
//       if (!response.ok) {
//         msg = `${response.status} when retrieving presigned URL from backend`;
//         // console.error(msg);
//         detail = await response.text();
//       } else {
//         const { presignedUrl } = await response.json();
//         // console.log(`Presigned URL: ${presignedUrl}`);

//         // Get the file's contents as an ArrayBuffer
//         const fileContent = await imageFile.arrayBuffer();
//         // console.log(`File content after arrayBuffer: ${fileContent}`);

//         // Upload the file content with the filename, hash and auth token
//         response = await fetch(presignedUrl, {
//           method: "PUT",
//           mode: "cors",
//           body: fileContent,
//           headers: {
//             "Content-Type": contentType,
//             Accept:
//               "image/avif,image/webp,image/apng,image/svg+xml,image/jpeg,image/*,*/*;q=0.8",
//           },
//         });

//         // Report on the outcome
//         if (response.status >= 200 && response.status < 300) {
//           msg = `${response.status} response from S3 API. Success!`;
//         } else if (response.status >= 400) {
//           msg = `${response.status} error from S3 API.`;
//         } else {
//           msg = `Unknown error.`;
//         }

//         detail = "[S3 PutObject does not return any content]";
//       }
//     } catch (error) {
//       console.error("Fetch threw an error:", error);
//       msg = `Fetch threw "${error}" - see the console and/or network tab for more details`;
//       detail = error.stack;
//     }

//     // console.log(`Upload file result: ${msg}`);
//     // console.log(`Response detail: ${detail}`);
//   };

//   const createPost = async () => {
//     const imageFile = image[0];
//     const imageName = imageFile.name;
//     const userId = session?.user?.id;
//     if (!userId) {
//       console.error("User ID is required.");
//       alert("You must be logged in to create a post!");
//       return;
//     }
//     // Ensure formData has required properties
//     if (!formData.title || !formData.link || !formData.image) {
//       // console.log(formData);
//       alert("Form input required!");
//       return;
//     }

//     try {
//       const imageReferenceUrl = process.env.NEXT_PUBLIC_DATABASE_IMAGE_URL;
//       // const endpointUrl = process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL;
//       // Include userId in the body
//       const body = {
//         ...formData, // Spread existing form data
//         image: `${imageReferenceUrl}/${imageName}`,
//         userId: userId, // Add userId to the body
//       };
//       // console.log(body);
//       const apiUrl = "/api/post";
//       const requestData = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       };

//       // console.log("REQ DATA", requestData);
//       const response = await fetch(apiUrl, requestData);

//       if (!response.ok) {
//         throw new Error(
//           `Failed to create post: ${response.status} - ${response.statusText}`
//         );
//       }
//       setFormData(""); // Reset the form after successful submission
//     } catch (error) {
//       console.log("Something went wrong:", error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       const fetchLists = async () => {
//         try {
//           const res = await fetch(`/api/lists/${userId}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           });
//           if (!res.ok) {
//             // console.log("RES IN userTest", res);
//             throw new Error("Failed to fetch posts");
//           }
//           const data = await res.json();
//           // console.log(data);
//           setLists(data);
//         } catch (err) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchLists();
//     }
//   }, [userId]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     // console.log("POST DATA:", formData);
//     uploadImageToB2();
//     createPost();
//     window.location.reload();
//   };

//   const removeImage = () => {
//     console.log("X clicked");
//     setIsImageDropped(true);
//     setImage(null); // Use null instead of empty string for clarity
//     setFormData({
//       ...formData,
//       image: "" // Clear the image in formData too
//     });
//   };

//   const preview = image && Array.isArray(image) ? image.map((file) => (
//     <div key={file.name} className="w-1/2 flex justify-center relative">
//       <div className="relative">
//         <button
//           className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1 cursor-pointer"
//           type="button"
//           onClick={removeImage}
//         >
//           <FaXmark className="w-5 h-5" color="white" />
//         </button>
//         <Image
//           src={file.preview}
//           alt={file.name}
//           className="object-cover"
//           width={350}
//           height={200}
//           // Revoke data uri after image is loaded
//           onLoad={() => {
//             URL.revokeObjectURL(file.preview);
//           }}
//         />
//       </div>
//     </div>
//   )) : null;

//   const handlePrivateToggle = (checked) => {
//     setEnabled(checked);
//     // Update the formData when the switch is toggled
//     setFormData((prevData) => ({
//       ...prevData,
//       isPrivate: checked, // Set isPrivate to the value of the switch
//     }));
//   };

//   return (
//     <form
//       onSubmit={onSubmit}
//       className="flex flex-col jusify-center place-content-center"
//     >
//       {isImageDropped ? (
//         <div
//           className="h-64 w-2/4 mx-auto bg-[#4C4138] border-dashed border-2 border-[#D7CDBF] flex flex-col jusify-center items-center place-content-center"
//           {...getRootProps()}
//         >
//           <input
//             defaultValue={formData.image}
//             name="image"
//             type="file"
//             accept="image/*"
//             {...getInputProps()}
//           />
//           <FaRegCircleUp className="w-5 h-5 fill-current" />
//           <p className="px-3 text-center">add image</p>
//         </div>
//       ) : (
//         <div className="h-fit w-full flex justify-center overflow-hidden">
//           {preview}
//         </div>
//       )}
//       <div className="flex flex-col mx-auto w-10/12	items-center px-5 pt-2">
//         <input
//           defaultValue={formData.title}
//           type="text"
//           name="title"
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           placeholder="title"
//           className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
//         />
//         <input
//           defaultValue={formData.link}
//           type="text"
//           name="link"
//           onChange={(e) => setFormData({ ...formData, link: e.target.value })}
//           placeholder="link"
//           className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
//         />
//         <textarea
//           defaultValue={formData.description}
//           type="text"
//           name="description"
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           rows={4}
//           placeholder="description"
//           className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
//         />
//         <input
//           placeholder={listTitle} // Shows the title in the placeholder
//           //   value={listId} // Set the value to listId to submit it
//           type="text"
//           name="list"
//           readOnly
//           className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
//           //   onFocus={() => setFormData({ ...formData, listId: listId })} // Ensure listId is set correctly when focused
//         />
//         {/* <input
//           placeholder={listTitle}
//           value={formData.listId}
//           type="text"
//           name="list"
//           onChange={(e) => setFormData({ ...formData, listId: e.target.value })}
//           className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] placeholder-[#000000] bg-[#4C4138]"
//         /> */}
//         <div className="flex my-2 self-start items-center">
//           <Field className="flex my-2 text-[#14100E] self-start items-center">
//             <Switch
//               checked={enabled}
//               onChange={handlePrivateToggle}
//               className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#D7CDBF]"
//             >
//               <span
//                 aria-hidden="true"
//                 className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
//               />
//             </Switch>
//             <Label className="pl-2">private</Label>
//           </Field>
//         </div>
//         <div className="w-full flex justify-end">
//           <button
//             onClick={closeModal}
//             type="button"
//             className="mr-4 text-[#000000] hover:text-[#14100E]"
//           >
//             cancel
//           </button>
//           <button
//             type="submit"
//             className={`w-1/2 ${
//               loading ? "bg-[#4C4138]" : "bg-[#14100E]"
//             } text-[#D7CDBF] p-2 hover:bg-[#000000] disabled:opacity-50`}
//             disabled={loading}
//           >
//             {loading ? "saving..." : "add post"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default AddPostForm;
