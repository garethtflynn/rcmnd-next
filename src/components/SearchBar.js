"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

function Search(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState();

  const searchUsers = async (query) => {
    if (query.trim() === "") {
      setFilteredUsers([]); // Don't show anything if query is empty
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?query=${query}`);
      const data = await response.json();
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }

    setLoading(false);
  };

  // Effect to call the fetchUsers function on query change (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500); // Delay by 500ms to avoid making a request on every keystroke

    return () => clearTimeout(timeoutId); // Clean up timeout if searchQuery changes quickly
  }, [searchQuery]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleUserSelect = (user) => {
    setSearchQuery("");
    setFilteredUsers([]);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto ml-4">
      {/* Search Input */}
      <input
        type="text"
        name="search"
        placeholder="search"
        onChange={handleSearch}
        value={searchQuery}
        className="w-36 sm:w-full py-2 border-b-2 border-[#FBF8F4] bg-transparent text-[#FBF8F4] hover:bg-[#131110] outline-none placeholder-[#14100E]"
      />

      {/* Search Results */}
      {filteredUsers.length > 0 && (
        <div className="absolute top-full mt-2 w-52 sm:w-full max-h-60 overflow-y-auto bg-[#FBF8F4] shadow-lg border border-[#FBF8F4] z-10 p-1 hover:bg-stone-300">
          {filteredUsers.map((user) => (
            <Link
              key={user.id}
              className="p-4 border-b cursor-pointer transition-all duration-300"
              href={`/user/${user.id}`}
              onClick={handleUserSelect}
            >
              <p>{user.firstName + " " + user.lastName}</p>
              <p className="text-sm text-[#4C4138]">@{user.username}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
