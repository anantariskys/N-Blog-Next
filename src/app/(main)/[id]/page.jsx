"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = ({ params }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user");
        setUser(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params]);
  
  return (
    <div className="max-w-4xl w-full  mx-auto">
      <header className=" pt-16 px-7 flex gap-20">
        {loading ? (
          <div className="size-36 rounded-full bg-neutral-700 animate-pulse"></div>
        ) : (
          user.user.image?(
            <img
            src={user?.user.image}
            className="size-36 rounded-full object-cover"
            alt=""
            draggable='false'
            />
          ):(
            <div className="size-36 rounded-full bg-neutral-700 overflow-hidden relative">
            <Image 
              src={'/images/fff0263a-8f19-4b74-8f3d-fc24b9561a96.svg'} 
              alt="avatar" 
              fill
              className="object-cover"
            />
          </div>
          )
        )}
        <div className="space-y-5">
          <div className="flex items-center gap-5">
            {loading ? (
              <div>laoding</div>
            ) : (
              <>
                <h1 className="text-lg">{user?.user.username}</h1>
                <Link
                  href={`/${params.userId}/update`}
                  className=" py-2  px-4 rounded-lg bg-neutral-700 text-sm"
                >
                  Edit Profile
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-8">
            {loading ? (
              <div>laoding</div>
            ) : (
              <>
                <p>{user?.totalPosts} posts</p>
                <p>{user?.totalFollower} followers</p>
                <p>{user?.totalFollowing} following</p>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Page;
