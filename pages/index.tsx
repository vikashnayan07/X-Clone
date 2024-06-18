import Image from "next/image";
import React, { useCallback, useState } from "react";
import { BsFeather, BsTwitterX } from "react-icons/bs";

import { GoHome } from "react-icons/go";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import {
  IoImageOutline,
  IoLocationOutline,
  IoNotificationsOutline,
  IoSearch,
} from "react-icons/io5";
import { FaRegEnvelope, FaRegSmile, FaRegUser } from "react-icons/fa";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CgMoreO } from "react-icons/cg";
import Feed from "@/components/Feed";

import { LuSquareSlash } from "react-icons/lu";

import toast from "react-hot-toast";
import { graphqlClient } from "@/client/api";
import { verifyGoogleUserTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";

import { MdOutlineGif } from "react-icons/md";
import { RiCalendarScheduleLine, RiListRadio } from "react-icons/ri";
import { useCreateTweets, useGetAllTweets } from "@/hooks/tweets";
import { Tweet } from "@/gql/graphql";

interface TwitterSideBar {
  title: string;
  icon: React.ReactNode;
}

const sideBarButton: TwitterSideBar[] = [
  { title: "Home", icon: <GoHome /> },
  { title: "Search", icon: <IoSearch /> },
  { title: "Notification", icon: <IoNotificationsOutline /> },
  { title: "Messages", icon: <FaRegEnvelope /> },
  { title: "Grok", icon: <LuSquareSlash /> },
  { title: "Communities", icon: <LiaUserFriendsSolid /> },
  { title: "Profile", icon: <FaRegUser /> },
  { title: "More", icon: <CgMoreO /> },
];

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();
  const { mutate } = useCreateTweets();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);
  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;

      if (!googleToken) return toast.error("invalid token");

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyGoogleUserTokenQuery,
        {
          token: googleToken,
        }
      );

      toast.success("Verified Success");
      console.log(verifyGoogleToken);
      if (verifyGoogleToken)
        window.localStorage.setItem("twitter-token", verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-[100px]">
        <div className="col-span-3  pt-1 ml-10   relative ">
          <div className="text-3xl h-fit hover:bg-zinc-800 rounded-full p-3 cursor-pointer transition-all w-fit">
            <BsTwitterX />
          </div>
          <div className="mt-1 text-xl font-semibold pr-4 ">
            <ul>
              {sideBarButton.map((item) => (
                <li
                  className="flex justify-start items-center gap-4 hover:bg-zinc-800 cursor-pointer transition-all rounded-full w-fit px-3 py-3 mt-2"
                  key={item.title}
                >
                  <span className="text-3xl">{item.icon}</span>{" "}
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 px-3 ">
              <button className="bg-[#1d9bf0] rounded-full px-4 py-3  w-full font-semibold text-lg ">
                Post
              </button>
            </div>
          </div>
          {user && (
            <div className=" absolute bottom-1 flex gap-2 items-center bg-zinc-800 px-3 py-2  rounded-full ">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-profile"
                  height={38}
                  width={38}
                />
              )}
              <div>
                <h3 className=" text-base font-medium">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-6 border-r-[0.1px] border-l-[0.1px]  border-gray-600   overflow-y-scroll no-scrollbar  ">
          <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-zinc-950 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                  {user?.profileImageURL && (
                    <Image
                      className="rounded-full"
                      src={user?.profileImageURL}
                      alt="user-pro"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
                <div className="col-span-11">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-xl px-3 border-b border-zinc-700"
                    rows={3}
                    placeholder="What's happening?!"
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <IoImageOutline
                        onClick={handleSelectImage}
                        className="text-xl"
                      />
                      <MdOutlineGif className="text-[20px] border-2 rounded-sm" />
                      <RiListRadio className="text-xl" />
                      <FaRegSmile className="text-xl" />
                      <RiCalendarScheduleLine className="text-xl" />
                      <IoLocationOutline className="text-xl" />
                    </div>

                    <div>
                      <button
                        onClick={handleCreateTweet}
                        className="bg-[#1d9bf0] rounded-full px-5 py-2   font-semibold text-sm "
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet) =>
            tweet ? <Feed key={tweet?.id} data={tweet as Tweet} /> : null
          )}
        </div>

        <div className="col-span-3 p-5">
          {!user && (
            <div className=" p-5 bg-slate-800 rounded-lg">
              <h1 className="text-2xl my-2 mx-2">New to Twitter</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
