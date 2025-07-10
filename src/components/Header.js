"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { animate, inView, scroll, stagger, timeline } from "motion";
import { IoMdSearch } from "react-icons/io";

import rcmndLogo from "../../public/rcmndLogo.png";
import SearchBar from "./SearchBar";
import CreateModal from "./CreateModal";
import CreatePostModal from "./CreatePostModal";
import CreateListModal from "./CreateListModal"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);

  // Refs for animation targets
  const menuRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const logoRef = useRef(null);
  const closeButtonRef = useRef(null);

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

  const openCreateModal = async () => {
    setShowCreateModal(true);
    setIsOpen(false);
  };

  const closeCreatePost = () => setIsCreatePostOpen(false);
  const closeCreateList = async () => setIsCreateListOpen(false);

  const openCreatePost = async () => {
    setIsCreatePostOpen(true);
    setShowCreateModal(false);
  };

  const openCreateList = async () => {
    setIsCreateListOpen(true);
    setShowCreateModal(false);
  };

  const handleMenuItemClick = async () => {
    setShowCreateModal(false);
    setIsOpen(false);
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
        <div className="hidden sm:block text-[#FBF8F4] place-content-center pl-2  ">
          <a href="/homeFeed" className="font-semibold text-2xl md:text-3xl">
            rcmnd
          </a>
        </div>
        <div className="w-full pl-2 sm:pl-0">
          <SearchBar />
        </div>
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

      <div
        ref={menuRef}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-60"
        style={{ display: "none", opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={closeButtonRef}
          className="absolute top-6 right-6 cursor-pointer text-[#F1E9DA] text-3xl"
          onClick={handleMenuItemClick}
          style={{ opacity: 0 }}
        >
          ✕
        </div>

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
            <button onClick={openCreateModal}>create</button>
          </div>
          <div
            ref={(el) => (menuItemsRef.current[2] = el)}
            className="text-2xl md:text-3xl text-[#F1E9DA] cursor-pointer"
            style={{ opacity: 0 }}
          >
            <Link href="/profilePage" onClick={() => setIsOpen(false)}>
              profile
            </Link>
          </div>
          <div
            ref={(el) => (menuItemsRef.current[3] = el)}
            className="text-2xl md:text-3xl text-[#F1E9DA] cursor-pointer"
            style={{ opacity: 0 }}
          >
            <Link href="/accountPage" onClick={() => setIsOpen(false)}>
              account
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
      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onPost={openCreatePost}
          onList={openCreateList}
        />
      )}

      {isCreatePostOpen && (
        <CreatePostModal isOpen={isCreatePostOpen} closeModal={closeCreatePost} />
      )}

      {isCreateListOpen && (
        <CreateListModal isOpen={isCreateListOpen} closeModal={closeCreateList} />
      )}
    </>
  );
}
