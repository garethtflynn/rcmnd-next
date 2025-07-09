"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import AccountPageForm from "@/components/AccountPageForm";
import Loading from "@/components/Loading";

function AccountPage(props) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUser(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch posts", error);
          setIsLoading(false);
        });
    }
  }, [userId]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className='h-screen w-full flex flex-col justify-center items-center bg-[#000000]'>
      <div>
        <AccountPageForm
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          username={user.username}
          password={user.password}
        />
      </div>
    </div>
  );
}

export default AccountPage;
