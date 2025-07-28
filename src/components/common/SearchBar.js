"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Input } from "@headlessui/react";

function Search(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounced search function
  const searchUsers = useCallback(async (query) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query.trim() === "") {
      setFilteredUsers([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    // Don't search for very short queries
    if (query.trim().length < 2) {
      setFilteredUsers([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      setFilteredUsers(data);
      setIsOpen(data.length > 0);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching users:", error);
        setError("Search failed. Please try again.");
        setFilteredUsers([]);
        setIsOpen(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);  
  }, [searchQuery, searchUsers]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleUserSelect = (user) => {
    setSearchQuery("");
    setFilteredUsers([]);
    setIsOpen(false);
    setError(null);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery("");
      setFilteredUsers([]);
    }
  };

  const showDropdown = isOpen && (filteredUsers.length > 0 || loading || error);

  return (
    <div className="relative w-full sm:flex sm:justify-center" ref={searchRef}>
      <div className="relative w-2/4 focus-within:w-3/4 md:focus-within:w-2/3 transition-all duration-700">
        <Input
          className="block w-full rounded-lg border px-3 text-base focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 py-2 border-[#FBF8F4] bg-transparent text-[#FBF8F4] hover:bg-[#252220] active:bg-[#252220] outline-none placeholder-[#252220] transition-all duration-700"
          type="text"
          name="search"
          placeholder="Search users..."
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          value={searchQuery}
          autoComplete="off"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          role="combobox"
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#FBF8F4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>


      {showDropdown && (
        <div className="absolute top-full mt-2 w-3/4 sm:w-2/3 max-h-60 overflow-y-auto bg-[#FBF8F4] shadow-lg border border-[#FBF8F4] z-10 rounded-lg">
          {loading && filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-[#1E1912]">Searching...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : filteredUsers.length > 0 ? (
            <div role="listbox">
              {filteredUsers.map((user, index) => (
                <Link
                  key={user.id}
                  className="block p-4 border-b last:border-b-0 cursor-pointer hover:bg-stone-200 transition-colors duration-200 focus:bg-stone-200 focus:outline-none"
                  href={`/user/${user.id}`}
                  onClick={() => handleUserSelect(user)}
                  role="option"
                  tabIndex={0}
                >
                  <p className="font-medium text-[#1E1912]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-[#1E1912]/70">@{user.username}</p>
                </Link>
              ))}
            </div>
          ) : (
            searchQuery.trim().length >= 2 && (
              <div className="p-4 text-center text-[#1E1912]/70">
                No users found for `{searchQuery}`
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Search;