// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useParams } from "next/navigation";

// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa";

// function UserLists(props) {
//   const router = useRouter();
//   const { userId } = useParams();

//   const [lists, setLists] = useState(null);
//   const [isLoading, setLoading] = useState(true);
//   const [isListsOpen, setIsListsOpen] = useState(false);

//   useEffect(() => {
//     if (userId) {
//       // console.log(userId)
//       const fetchLists = async () => {
//         try {
//           const res = await fetch(`/api/user/${userId}`, {
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
//           setLists(data.lists);
//         } catch (err) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchLists();
//     }
//   }, [userId]);

//   const handleListClick = (listId) => {
//     // console.log("List ID:", listId);
//     router.push(`/list/${listId}`); // Navigate to the list page
//   };

//   const handleToggle = () => {
//     setIsListsOpen(!isListsOpen);
//   };

//   return (
//     <>
//       <div className={`px-3 ${isListsOpen ? 'col-span-2' : ''}`}>
//         <div
//           className={`
//             relative overflow-hidden transition-all duration-500 ease-in-out
//             ${isListsOpen ? "w-full" : "w-auto inline-block"}
//           `}
//         >
//           {/* Button/Expanded Container */}
//           <div
//             className={`
//               flex items-center transition-all duration-500 ease-in-out
//               rounded-md bg-[#000000] shadow-sm ring-1 ring-inset ring-[#252220] 
//               hover:bg-[#252220] cursor-pointer
//               ${
//                 isListsOpen
//                   ? "px-4 py-1 justify-start gap-4 overflow-x-auto no-scrollbar "
//                   : "px-4 py-1 justify-center gap-x-1.5"
//               }
//             `}
//             onClick={!isListsOpen ? handleToggle : undefined}
//           >
//             {/* Lists Button (collapsed state) */}
//             {!isListsOpen && (
//               <>
//                 <span className="text-lg font-semibold text-[#FBF8F4] italic transition-colors duration-700">
//                   Lists
//                 </span>
//                 <FaAngleDown
//                   className="self-center transition-transform duration-300"
//                   color="#FBF8F4"
//                 />
//               </>
//             )}

//             {/* Expanded Lists (expanded state) */}
//             {isListsOpen && (
//               <>
//                 {/* Close button */}
//                 <button
//                   onClick={handleToggle}
//                   className="flex-shrink-0 p-1 hover:bg-[#252220] rounded transition-colors duration-700"
//                 >
//                   <FaAngleUp color="#FBF8F4" />
//                 </button>

//                 {/* Horizontal scrollable lists */}
//                 <div className="flex gap-6 overflow-x-auto no-scrollbar py-1">
//                   <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar text-[#D7CDBF] text-lg overflow-x-auto">
//                     {lists?.map((list) => {
//                       return (
//                         <button
//                           key={list.id}
//                           onClick={() => handleListClick(list.id)}
//                           className="text-[#D7CDBF] cursor-pointer text-xl text-nowrap	"
//                         >
//                           {list.title}
//                         </button>
//                       );
//                     })}
//                   </ul>

//                   {/* {lists && lists.length > 0 ? (
//                     lists.map((list, index) => (
//                       <button
//                         key={list.id}
//                         onClick={() => handleListClick(list.id)}
//                         className={`
//                           flex-shrink-0 px-4 py-2 text-[#FBF8F4] text-base italic
//                           hover:bg-[#252220] rounded transition-all duration-200
//                           transform hover:scale-105 cursor-pointer text-nowrap
//                           opacity-0 animate-fade-in
//                         `}
//                         style={{
//                           animationDelay: `${index * 100}ms`,
//                           animationFillMode: 'forwards'
//                         }}
//                       >
//                         {list.title}
//                       </button>
//                     ))
//                   ) : (
//                     <div className="px-4 py-2 text-[#FBF8F4] text-lg italic opacity-70">
//                       {isLoading ? "Loading lists..." : "No lists found"}
//                     </div>
//                   )} */}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Custom CSS for animations */}
//       <style jsx>{`
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }

//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.4s ease-out;
//         }
//       `}</style>
//     </>

//     // <div className="max-w-screen">
//     //   <Menu as="div" className="relative inline-block text-left">
//     //     <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-[#000000] px-4 py-1 text-base font-semibold text-[#FBF8F4] shadow-sm ring-1 ring-inset ring-[#252220] hover:bg-[#252220] italic transition-colors duration-200">
//     //       Lists
//     //       <FaAngleDown className="self-center" color="#FBF8F4" />
//     //     </MenuButton>

//     //     <MenuItems className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded bg-[#000000] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//     //       <div className="py-1">
//     //         {lists && lists.length > 0 ? (
//     //           lists.map((list) => (
//     //             <MenuItem key={list.id}>
//     //               {({ focus }) => (
//     //                 <button
//     //                   onClick={() => handleListClick(list.id)}
//     //                   className={`${
//     //                     focus ? "bg-gray-800 text-[#FBF8F4]" : "text-[#FBF8F4]"
//     //                   } group flex w-full items-center px-4 py-3 text-lg font-semibold italic cursor-pointer text-left hover:bg-gray-800 transition-colors duration-150`}
//     //                 >
//     //                   {list.title}
//     //                 </button>
//     //               )}
//     //             </MenuItem>
//     //           ))
//     //         ) : (
//     //           <div className="px-4 py-3 text-[#FBF8F4] text-lg italic">
//     //             No lists found
//     //           </div>
//     //         )}
//     //       </div>
//     //     </MenuItems>
//     //   </Menu>
//     // </div>
//     // <div className="max-w-screen px-3">
//     // <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar bg-[#000000] text-[#D7CDBF] text-xl overflow-x-auto">
//     //   {lists?.map((list) => {
//     //     return (
//     //       <li
//     //         key={list.id}
//     //         onClick={() => handleListClick(list.id)}
//     //         className="text-[#D7CDBF] p-2 cursor-pointer text-xl text-nowrap	"
//     //       >
//     //         {list.title}
//     //       </li>
//     //     );
//     //   })}
//     // </ul>
//     // </div>
//   );
// }

// export default UserLists;

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

function UserLists({ isListsOpen, setIsListsOpen }) {
  const router = useRouter();
  const { userId } = useParams();

  const [lists, setLists] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // console.log(userId)
      const fetchLists = async () => {
        try {
          const res = await fetch(`/api/user/${userId}`, {
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
          setLists(data.lists);
        } catch (err) {
          // setError(err.message);
          console.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [userId]);

  const handleListClick = (listId) => {
    // console.log("List ID:", listId);
    router.push(`/list/${listId}`); // Navigate to the list page
  };

  const handleToggle = () => {
    setIsListsOpen(!isListsOpen);
  };

  return (
    <>
      <div className="px-2">
        <div
          className={`
            flex items-center transition-all duration-500 ease-in-out
            rounded-md bg-[#000000] shadow-sm ring-1 ring-inset ring-[#252220] 
            hover:bg-[#252220] cursor-pointer
            ${
              isListsOpen
                ? "px-4 py-1 justify-start gap-4 overflow-x-auto no-scrollbar"
                : "px-4 py-1 justify-center gap-x-1.5 w-36"
            }
          `}
          onClick={!isListsOpen ? handleToggle : undefined}
        >
          {/* Lists Button (collapsed state) */}
          {!isListsOpen && (
            <>
              <button className="text-lg font-semibold text-[#FBF8F4] italic transition-colors duration-700">
                Lists
              </button>
              <FaAngleDown
                className="self-center transition-transform duration-300"
                color="#FBF8F4"
              />
            </>
          )}

          {/* Expanded Lists (expanded state) */}
          {isListsOpen && (
            <>
              {/* Close button */}
              <button
                onClick={handleToggle}
                className="flex-shrink-0 p-1 hover:bg-[#252220] rounded transition-colors duration-200"
              >
                <FaAngleUp color="#FBF8F4" />
              </button>

              {/* Horizontal scrollable lists */}
              <div className="flex gap-6 overflow-x-auto no-scrollbar py-1">
                {lists && lists.length > 0 ? (
                  <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar text-[#D7CDBF] text-lg overflow-x-auto">
                    {lists.map((list) => {
                      return (
                        <li key={list.id}>
                          <button
                            onClick={() => handleListClick(list.id)}
                            className="text-[#D7CDBF] cursor-pointer text-xl text-nowrap hover:text-[#FBF8F4] transition-colors duration-200"
                          >
                            {list.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-[#FBF8F4] text-lg italic opacity-70">
                    {isLoading ? "Loading lists..." : "No lists found"}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

export default UserLists;