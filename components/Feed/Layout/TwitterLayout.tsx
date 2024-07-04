import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo } from "react";
import { BsFeather, BsTwitterX } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { LuSquareSlash } from "react-icons/lu";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/client/api";
import { verifyGoogleUserTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface TwitterSideBar {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface TwitterLayoutProps {
  children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sideBarButton: TwitterSideBar[] = useMemo(
    () => [
      { title: "Home", icon: <GoHome />, link: "/" },
      { title: "Search", icon: <IoSearch />, link: "/" },
      { title: "Notification", icon: <IoNotificationsOutline />, link: "/" },
      { title: "Messages", icon: <FaRegEnvelope />, link: "/" },
      { title: "Grok", icon: <LuSquareSlash />, link: "/" },
      { title: "Communities", icon: <LiaUserFriendsSolid />, link: "/" },
      { title: "Profile", icon: <FaRegUser />, link: `/${user?.id}` },
      { title: "More", icon: <CgMoreO />, link: "/" },
    ],
    [user?.id]
  );

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
      <div className="grid grid-cols-12 h-screen w-screen sm:px-[100px] ">
        <div className="col-span-2 sm:col-span-3 pt-1 flex  sm:justify-start relative sm:pl-4">
          <div>
            <div className="text-3xl h-fit hover:bg-zinc-800 rounded-full p-3 cursor-pointer transition-all w-fit">
              <BsTwitterX />
            </div>
            <div className=" text-xl font-semibold pr-4 ">
              <ul>
                {sideBarButton.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.link}
                      className="flex justify-start items-center gap-4 hover:bg-zinc-800 cursor-pointer transition-all rounded-full w-fit px-3 py-3 "
                    >
                      <span className="text-2xl">{item.icon}</span>{" "}
                      <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 px-3 ">
                <button className="hidden sm:block bg-[#1d9bf0] rounded-full px-3 py-[8px]  w-full  font-semibold text-lg ">
                  Post
                </button>
                <button className="block sm:hidden bg-[#1d9bf0] rounded-full px-4 py-[20px]  font-semibold text-lg mx-[-9px] ">
                  <BsFeather />
                </button>
              </div>
            </div>
          </div>
          {user && (
            <div className=" absolute bottom-1 flex gap-2 items-center bg-zinc-800 px-[9px] py-1  rounded-full  ">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-profile"
                  height={38}
                  width={38}
                />
              )}
              <div className="hidden sm:block">
                <h3 className=" text-base font-medium">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-10 sm:col-span-5 border-r-[0.1px] border-l-[0.1px]  border-gray-600   overflow-y-scroll no-scrollbar ">
          {props.children}
        </div>

        <div className="col-span-0 sm:col-span-3 p-5">
          {!user ? (
            <div className=" p-5 bg-slate-800 rounded-lg">
              <h1 className="text-2xl my-2 mx-2">New to Twitter</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          ) : (
            <div className=" px-6 py-3 bg-gray-900 rounded-lg">
              <h1 className="text-2xl my-2 mx-2 font-semibold mb-5">
                who to follow
              </h1>
              {user?.recommendedUsers?.map((el) => (
                <div key={el?.id} className="flex gap-2 items-center mt-3 ">
                  {el?.profileImageURL && (
                    <Image
                      className=" rounded-full "
                      src={el?.profileImageURL}
                      alt="img-user"
                      width={50}
                      height={50}
                    />
                  )}
                  <div>
                    <div className="text-lg ">
                      {el?.firstName} {el?.lastName}
                    </div>
                    <Link
                      href={`/${el?.id}`}
                      className="bg-white text-black text-sm w-full px-4 py-1 rounded-lg "
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
