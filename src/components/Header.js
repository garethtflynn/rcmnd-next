"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { animate, inView, scroll, stagger, timeline } from "motion";

import rcmndLogo from "../../public/rcmndLogo.png";
import SearchBar from "./SearchBar";

export default function Header() {
  // State to control the menu visibility
  const [isOpen, setIsOpen] = useState(false);

  // Refs for animation targets
  const menuRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const logoRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);

    // Animate logo on click
    if (logoRef.current) {
      animate(
        logoRef.current,
        { scale: [1, 1.1, 1] },
        { duration: 0.3, easing: "ease-in-out" }
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/welcome" });
      console.log("logged out!");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Menu animation when visibility changes
  useEffect(() => {
    if (!menuRef.current || !menuOverlayRef.current) return;

    if (isOpen) {
      // Show menu overlay
      menuOverlayRef.current.style.display = "block";
      menuRef.current.style.display = "flex";

      // Overlay fade in
      animate(
        menuOverlayRef.current,
        { opacity: [0, 1] },
        { duration: 0.3, easing: "ease-out" }
      );

      // Menu animation
      animate(
        menuRef.current,
        {
          opacity: [0, 1],
          scale: [0.98, 1],
        },
        {
          duration: 0.4,
          easing: "ease-out",
        }
      );

      // Close button animation
      if (closeButtonRef.current) {
        animate(
          closeButtonRef.current,
          { opacity: [0, 1], rotate: [-20, 0] },
          { duration: 0.3, delay: 0.2 }
        );
      }

      // Staggered animation for menu items
      if (menuItemsRef.current.length > 0) {
        animate(
          menuItemsRef.current,
          {
            opacity: [0, 1],
            y: [20, 0],
          },
          {
            delay: stagger(0.07),
            duration: 0.3,
            easing: "ease-out",
          }
        );
      }
    } else {
      // Hide menu with animation
      animate(
        menuOverlayRef.current,
        { opacity: [1, 0] },
        { duration: 0.3, easing: "ease-in" }
      );

      const menuAnimation = animate(
        menuRef.current,
        {
          opacity: [1, 0],
          scale: [1, 0.98],
        },
        {
          duration: 0.3,
          easing: "ease-in",
        }
      );

      // Hide menu after animation completes
      menuAnimation.finished.then(() => {
        if (menuRef.current && menuOverlayRef.current) {
          menuRef.current.style.display = "none";
          menuOverlayRef.current.style.display = "none";
        }
      });
    }
  }, [isOpen]);

  // Setup hover animations for menu items
  useEffect(() => {
    menuItemsRef.current.forEach((item) => {
      if (!item) return;

      item.addEventListener("mouseenter", () => {
        animate(
          item,
          {
            scale: 1.25,
            // x: 10,
          },
          { duration: 0.35 }
        );
      });

      item.addEventListener("mouseleave", () => {
        animate(
          item,
          {
            scale: 1,
            x: 0,
          },
          { duration: 0.2 }
        );
      });
    });
  }, [isOpen]);

  return (
    <>
      <nav className="w-full flex h-max bg-[#000000] duration-1000 py-4 z-20">
        <div className="text-[#FBF8F4] place-content-center pl-2">
          <a href="/homeFeed" className="font-semibold text-2xl md:text-3xl">
            rcmnd
          </a>
        </div>
        <SearchBar />
        <div className="w-auto flex-grow lg:w-auto flex flex-end items-center">
          <div className="w-full text-sm flex justify-end items-center">
            <div className="relative">
              {/* Logo */}
              <div
                ref={logoRef}
                onClick={toggleMenu}
                className="cursor-pointer pr-2 z-20"
              >
                <Image
                  src={rcmndLogo}
                  alt="rcmnd"
                  width={50}
                  height={40}
                  className="w-6 sm:w-8 md:w-9 lg:w-10 xl:w-11 h-auto"
                  style={{ maxWidth: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Modal Overlay */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 bg-black bg-opacity-80 z-30"
        style={{ display: "none", opacity: 0 }}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Fullscreen Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-60"
        style={{ display: "none", opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div
          ref={closeButtonRef}
          className="absolute top-6 right-6 cursor-pointer text-[#F1E9DA] text-3xl"
          onClick={() => setIsOpen(false)}
          style={{ opacity: 0 }}
        >
          ✕
        </div>

        {/* Menu content */}
        <div className="text-center space-y-6">
          <div
            ref={(el) => (menuItemsRef.current[0] = el)}
            className="text-2xl md:text-3xl text-[#F1E9DA] cursor-pointer"
            style={{ opacity: 0 }}
          >
            <Link href="/homeFeed" onClick={() => setIsOpen(false)}>
              home
            </Link>
          </div>
          <div
            ref={(el) => (menuItemsRef.current[1] = el)}
            className="text-2xl md:text-3xl text-[#F1E9DA] cursor-pointer"
            style={{ opacity: 0 }}
          >
            <Link href="/createPost" onClick={() => setIsOpen(false)}>
              create post
            </Link>
          </div>
          <div
            ref={(el) => (menuItemsRef.current[2] = el)}
            className="text-2xl md:text-3xl text-[#F1E9DA] cursor-pointer"
            style={{ opacity: 0 }}
          >
            <Link href="/createList" onClick={() => setIsOpen(false)}>
              create list
            </Link>
          </div>
          <div
            ref={(el) => (menuItemsRef.current[3] = el)}
            className="text-2xl md:text-3xl text-[#F1E9DA] cursor-pointer"
            style={{ opacity: 0 }}
          >
            <Link href="/profilePage" onClick={() => setIsOpen(false)}>
              profile
            </Link>
          </div>

          <div
            ref={(el) => (menuItemsRef.current[4] = el)}
            className="text-2xl md:text-3xl text-[#F1E9DA] cursor-pointer"
            style={{ opacity: 0 }}
          >
            <button
              onClick={handleLogout}
              className="bg-transparent border-none text-2xl md:text-3xl text-[#F1E9DA]"
            >
              sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { signOut } from "next-auth/react";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// import rcmndLogo from "../../public/rcmndLogo.png";
// import SearchBar from "./SearchBar";
// import Image from "next/image";

// export default function Header() {
//   const handleLogout = async () => {
//     try {
//       await signOut({ redirect: true, callbackUrl: "/welcome" });
//       console.log("logged out!");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <nav className="w-full flex h-max bg-[#000000] duration-1000 py-4">
//       <div className="text-[#FBF8F4] place-content-center pl-2">
//         <a href="/homeFeed" className="font-semibold text-2xl md:text-3xl">
//           rcmnd
//         </a>
//       </div>
//       <SearchBar />
//       <div className="w-auto flex-grow lg:w-auto flex flex-end items-center">
//         <div className="w-full text-sm flex justify-end items-center">
//           <Menu
//             as="div"
//             className="relative inline-block text-left bg-transparent duration-1000"
//           >
//             <MenuButton className="full flex justify-center items-center pr-2">
//               <Image
//                 src={rcmndLogo}
//                 alt="rcmnd"
//                 width={50}
//                 height={40}
//                 className="w-6 sm:w-8 md:w-9 lg:w-10 xl:w-11 h-auto"
//                 style={{ maxWidth: "none" }}
//               />
//             </MenuButton>
//             <MenuItems
//               transition
//               className="absolute right-0 z-10 mt-3 w-40 origin-top-right bg-[#252220] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
//             >
//               <MenuItem>
//                 <Link
//                   href="/createPost"
//                   className="block px-4 py-2 text-sm text-[#F1E9DA] hover:opacity-25"
//                 >
//                   create post
//                 </Link>
//               </MenuItem>
//               <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] hover:opacity-25">
//                 <Link href="/createList">create list</Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link
//                   href="/profilePage"
//                   className="block w-full px-4 py-2 text-left text-sm text-[#F1E9DA] hover:opacity-25"
//                 >
//                   profile
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full px-4 py-2 text-left text-sm text-[#F1E9DA] font- hover:opacity-25"
//                 >
//                   sign out
//                 </button>
//               </MenuItem>
//             </MenuItems>
//           </Menu>
//           <Menu
//             as="div"
//             className="relative inline-block text-left bg-transparent hover:text-[#FBF8F4] duration-1000"
//           ></Menu>
//         </div>
//       </div>
//     </nav>
//   );
// }
