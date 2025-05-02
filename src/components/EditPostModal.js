"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Field, Label, Switch } from "@headlessui/react";
import { FaRegCircleUp, FaXmark } from "react-icons/fa6";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

const EditPostModal = ({
  isOpen,
  closeModal,
  id,
  image,
  title,
  link,
  description,
  list,
  listId,
  isPrivate,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState(null);
  const [enabled, setEnabled] = useState(isPrivate);
  const [isImageDropped, setIsImageDropped] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  const [newImage, setNewImage] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [conversionError, setConversionError] = useState(null);

  const [formData, setFormData] = useState({
    postId: id,
    title: title,
    image: image,
    link: link,
    description: description,
    listId: listId,
    isPrivate: isPrivate,
  });

  // Set isBrowser to true once the component mounts
  useEffect(() => {
    setIsBrowser(true);
  }, []);

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
            throw new Error("Failed to fetch lists");
          }
          const data = await res.json();
          setLists(data);
        } catch (err) {
          setConversionError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [userId]);

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

        setIsImageDropped(true);
        setNewImage(processedFileWithPreview);
        setCurrentImage(preview);
        setFormData({ ...formData, image: processedFile });
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
    if (isBrowser && newImage && newImage.preview) {
      return () => URL.revokeObjectURL(newImage.preview);
    }
  }, [newImage, isBrowser]);

  // Process image with Sharp and upload to B2 in one step
  const processAndUploadImage = async () => {
    if (!isBrowser || !newImage) return null;

    setIsUploading(true);
    setConversionError(null);

    try {
      const imageFile = newImage;

      // Create a FormData object to send the image to our API
      const formData = new FormData();
      formData.append("image", imageFile);

      // Send to our single API endpoint that handles processing and uploading
      const response = await fetch("/api/upload-with-processing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to process and upload image"
        );
      }

      // Get the processed image URL
      const result = await response.json();
      return result.url; // Return the URL of the uploaded image
    } catch (error) {
      console.error("Process and upload error:", error);
      setConversionError(
        `Failed to process and upload image: ${error.message}`
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handlePrivateToggle = (checked) => {
    setEnabled(checked);
    // Update the formData when the switch is toggled
    setFormData((prevData) => ({
      ...prevData,
      isPrivate: checked, // Set isPrivate to the value of the switch
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updatePost = async (imageUrl) => {
    if (!userId) {
      console.error("User ID is required.");
      setConversionError("You must be logged in to update a post!");
      return false;
    }

    try {
      const body = {
        ...formData,
        image: imageUrl || formData.image, // Use new image URL if provided, otherwise keep the current one
        userId: userId,
      };

      const response = await fetch(`/api/post/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update post: ${response.status} - ${response.statusText}`
        );
      }
      return true;
    } catch (error) {
      console.error("Post update error:", error);
      setConversionError(`Failed to update post: ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConversionError(null);
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Only process and upload a new image if one has been selected
      if (newImage) {
        imageUrl = await processAndUploadImage();
        if (!imageUrl) {
          setLoading(false);
          return; // Stop if upload failed
        }
      }

      // Then update the post in your database with the processed image URL
      const postSuccess = await updatePost(imageUrl);
      if (!postSuccess) {
        setLoading(false);
        return; // Stop if post update failed
      }

      // If everything succeeded, close modal and refresh
      closeModal();
      router.refresh();
    } catch (error) {
      console.error("Error during submission:", error);
      setConversionError("An error occurred while saving your changes.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setIsImageDropped(false);
    if (newImage && newImage.preview) {
      URL.revokeObjectURL(newImage.preview);
    }
    setNewImage(null);
    setCurrentImage(null);
    setFormData({
      ...formData,
      image: "",
    });
    setConversionError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#4C4138] p-6 shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl rounded-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-[#000000] text-end">
          edit post
        </h2>
        <form onSubmit={handleSubmit}>
          {!currentImage ? (
            <div
              className="h-48 w-full sm:w-3/4 md:w-2/3 mx-auto bg-[#4C4138] border-dashed border-2 border-[#D7CDBF] flex flex-col justify-center items-center"
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
            <div className="relative">
              <button
                className="absolute top-0 right-4 z-10 bg-black bg-opacity-50 rounded-full p-1 cursor-pointer"
                type="button"
                onClick={removeImage}
              >
                <FaXmark className="w-5 h-5" color="white" />
              </button>
              {isConverting ? (
                <div className="h-48 flex items-center justify-center">
                  <p>loading...</p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Image
                    src={currentImage}
                    alt={description}
                    className="object-cover w-full h-auto max-h-[300px]"
                    width={300}
                    height={200}
                  />
                </div>
              )}
            </div>
          )}

          {conversionError && (
            <div className="mx-auto w-full mt-2 bg-red-800 bg-opacity-50 text-[#FBF8F4] p-2 rounded">
              {conversionError}
            </div>
          )}

          <div className="my-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#000000]"
            >
              title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={title}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] bg-[#4C4138]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="link"
              className="block text-sm font-medium text-[#000000]"
            >
              link
            </label>
            <input
              type="text"
              id="link"
              name="link"
              defaultValue={link}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] bg-[#4C4138]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#000000]"
            >
              description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] bg-[#4C4138]"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="list"
              className="block text-sm font-medium text-[#000000]"
            >
              list
            </label>
            <select
              className="border border-[#14100E] bg-transparent text-[#14100E] mt-2 px-2 py-1 focus:within:bg-[#D7CDBF] outline-none w-full block p-2"
              defaultValue={listId}
              onChange={(e) =>
                setFormData({ ...formData, listId: e.target.value })
              }
            >
              <option value="">select a list</option>
              {lists?.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </select>
          </div>
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
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-4 text-[#000000] hover:text-[#14100E]"
            >
              cancel
            </button>
            <button
              type="submit"
              className={`w-1/2 ${
                loading ? "bg-[#4C4138]" : "bg-[#14100E]"
              } text-[#D7CDBF] p-2 hover:bg-[#000000] disabled:opacity-50`}
              disabled={loading || isConverting || isUploading}
            >
              {loading || isUploading ? "saving..." : "save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;

// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { Field, Label, Switch } from "@headlessui/react";
// import { FaRegCircleUp, FaXmark } from "react-icons/fa6";
// import { useDropzone } from "react-dropzone";
// import { useRouter } from "next/navigation";
// import heic2any from "heic2any";

// const EditPostModal = ({
//   isOpen,
//   closeModal,
//   id,
//   image,
//   title,
//   link,
//   description,
//   list,
//   listId,
//   isPrivate,
// }) => {
//   const { data: session } = useSession();
//   const userId = session?.user?.id;
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [lists, setLists] = useState(null);
//   const [enabled, setEnabled] = useState(isPrivate);
//   const [isImageRemoved, setIsImageRemoved] = useState(false);
//   const [currentImage, setCurrentImage] = useState(image);
//   const [newImage, setNewImage] = useState(null);
//   const [formData, setFormData] = useState({
//     postId: id,
//     title: title,
//     image: image,
//     link: link,
//     description: description,
//     listId: listId,
//     isPrivate: isPrivate,
//   });

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
//             throw new Error("Failed to fetch lists");
//           }
//           const data = await res.json();
//           //   console.log(data);
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

//   const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
//     accept: {
//       "image/*": [],
//     },
//     onDrop: (acceptedFiles) => {
//       console.log(acceptedFiles);
//       const fileAsString = JSON.stringify(acceptedFiles);

//       // Create object URL for preview
//       const fileWithPreview = acceptedFiles.map((file) =>
//         Object.assign(file, {
//           preview: URL.createObjectURL(file),
//         })
//       )[0]; // Get the first file

//       setNewImage(fileWithPreview);
//       setCurrentImage(fileWithPreview.preview);
//       setIsImageRemoved(false);
//       setFormData((prevData) => {
//         const newData = {
//           ...prevData,
//           image: fileAsString,
//         };
//         console.log("Updated formData:", newData);
//         return newData;
//       });
//       console.log("new image:", newImage);
//     },
//   });

//   // const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
//   //   accept: {
//   //     "image/*": [],
//   //   },
//   //   onDrop: (acceptedFiles) => {
//   //     // console.log("ON DROP ACCEPTED FILE", acceptedFiles);
//   //     const file = acceptedFiles;
//   //     console.log(file);
//   //     const fileAsString = JSON.stringify(acceptedFiles);
//   //     setIsImageRemoved(false);
//   //     setFormData({ ...formData, image: fileAsString });
//   //     setNewImage(
//   //       acceptedFiles.map((file) =>
//   //         Object.assign(file, {
//   //           preview: URL.createObjectURL(file),
//   //         })
//   //       )
//   //     );
//   //   },
//   // });

//   useEffect(() => {
//     // Revoke the data uris to avoid memory leaks
//     return () => {
//       if (newImage && Array.isArray(newImage)) {
//         newImage.forEach((file) => URL.revokeObjectURL(file.preview));
//       } else if (newImage && newImage.preview) {
//         URL.revokeObjectURL(newImage.preview);
//       }
//     };
//   }, [newImage]);

//   const handlePrivateToggle = (checked) => {
//     setEnabled(checked);
//     // Update the formData when the switch is toggled
//     setFormData((prevData) => ({
//       ...prevData,
//       isPrivate: checked, // Set isPrivate to the value of the switch
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const uploadImageToB2 = async () => {
//     const imageFile = newImage;
//     console.log(imageFile);
//     const key = imageFile.name;
//     console.log("KEY:", key);
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
//       );
//       if (!response.ok) {
//         msg = `${response.status} when retrieving presigned URL from backend`;
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
//   };

//   const editPost = async () => {
//     const imageFile = newImage;
//     const updatedNewImage = imageFile.name;
//     setLoading(true);
//     try {
//       const imageReferenceUrl = process.env.NEXT_PUBLIC_DATABASE_IMAGE_URL;
//       const body = {
//         ...formData,
//         image: `${imageReferenceUrl}/${updatedNewImage}`,
//         userId: userId,
//       };
//       const response = await fetch(`/api/post/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body), // Send the form data as a JSON string
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update post");
//       }

//       closeModal();
//     } catch (error) {
//       console.error("Error updating post:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("submitting form:", formData);
//     uploadImageToB2();
//     editPost();
//     router.replace("/profilePage");
//   };

//   const removeImage = () => {
//     console.log("X clicked");
//     setIsImageRemoved(true);
//     setFormData((prevFormData) => {
//       const newFormData = {
//         ...prevFormData,
//         image: "", // Clear the image
//       };
//       console.log("Updated formData:", newFormData);
//       return newFormData;
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
//       <div className="bg-[#4C4138] p-6 shadow-md w-96">
//         <h2 className="text-xl font-bold mb-4 text-[#000000] text-end">
//           edit post
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {isImageRemoved ? (
//             <div
//               className="h-48 w-2/4 mx-auto bg-[#4C4138] border-dashed border-2 border-[#D7CDBF] flex flex-col jusify-center items-center place-content-center"
//               {...getRootProps()}
//             >
//               <input name="image" type="file" {...getInputProps()} />
//               <FaRegCircleUp className="w-5 h-5 fill-current" />
//               <p className="px-3 text-center">add image</p>
//             </div>
//           ) : (
//             <div className="relative">
//               <button
//                 className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1 cursor-pointer"
//                 type="button"
//                 onClick={removeImage}
//               >
//                 <FaXmark className="w-5 h-5" color="white" />
//               </button>
//               <Image
//                 src={currentImage}
//                 alt={description}
//                 className="object-cover"
//                 width={350}
//                 height={200}
//               />
//             </div>
//           )}
//           <div className="my-4">
//             <label
//               htmlFor="title"
//               className="block text-sm font-medium text-[#000000]"
//             >
//               title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               defaultValue={title}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] bg-[#4C4138]"
//             />
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="link"
//               className="block text-sm font-medium text-[#000000]"
//             >
//               link
//             </label>
//             <input
//               type="text"
//               id="link"
//               name="link"
//               defaultValue={link}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] bg-[#4C4138]"
//             />
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="description"
//               className="block text-sm font-medium text-[#000000]"
//             >
//               description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               defaultValue={description}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-[#14100E] text-[#14100E] bg-[#4C4138]"
//             />
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="list"
//               className="block text-sm font-medium text-[#000000]"
//             >
//               list
//             </label>
//             <select
//               className="border border-[#14100E] bg-transparent text-[#14100E] mt-2 px-2 py-1 focus:within:bg-[#D7CDBF] outline-none w-full block p-2"
//               onChange={(e) =>
//                 setFormData({ ...formData, listId: e.target.value })
//               }
//             >
//               <option>{list}</option>
//               {lists?.map((list) => {
//                 return (
//                   <option key={list.id} value={list.id}>
//                     {list.title}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           <div className="flex my-2 self-start items-center">
//             <Field className="flex my-2 text-[#14100E] self-start items-center">
//               <Switch
//                 checked={enabled}
//                 onChange={handlePrivateToggle}
//                 className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#D7CDBF]"
//               >
//                 <span
//                   aria-hidden="true"
//                   className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
//                 />
//               </Switch>
//               <Label className="pl-2">private</Label>
//             </Field>
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={closeModal}
//               className="mr-4 text-[#000000] hover:text-[#14100E]"
//             >
//               cancel
//             </button>
//             <button
//               type="submit"
//               className={`w-1/2 ${
//                 loading ? "bg-[#4C4138]" : "bg-[#14100E]"
//               } text-[#D7CDBF] p-2 hover:bg-[#000000] disabled:opacity-50`}
//               disabled={loading}
//             >
//               {loading ? "saving..." : "save changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPostModal;
