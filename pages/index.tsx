import Image from "next/image";
import React, { useCallback } from "react";
import { BsFeather, BsTwitterX } from "react-icons/bs";

import { GoHome } from "react-icons/go";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CgMoreO } from "react-icons/cg";
import Feed from "@/components/Feed";

import { LuSquareSlash } from "react-icons/lu";

import { HiPlusSm } from "react-icons/hi";
import toast from "react-hot-toast";
import { graphqlClient } from "@/client/api";
import { verifyGoogleUserTokenQuery } from "@/graphql/query/user";

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
    },
    []
  );
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3  pt-1 ml-20  scrollbar-thin overflow-y-scroll overflow-x-hidden ">
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
              <button className="bg-[#1d9bf0] rounded-full px-6 py-3 mr-3">
                <div className="items-center ">
                  {" "}
                  <HiPlusSm className="text-2xl font-bold " />{" "}
                </div>
                <div className=" mt-[-4px] ">
                  <BsFeather className="text-3xl " />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-6 border-r-[0.1px] border-l-[0.1px]  border-gray-600   overflow-y-scroll no-scrollbar  ">
          <Feed />
          <Feed />

          <Feed />
          <Feed />
          <Feed />
          <Feed />

          <Feed />
          <Feed />
          <Feed />
          <Feed />
        </div>

        <div className="col-span-3 p-5">
          <div className=" p-5 bg-slate-800 rounded-lg">
            <h1 className="text-2xl my-2 mx-2">New to Twitter</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        </div>
      </div>
    </div>
  );
}
