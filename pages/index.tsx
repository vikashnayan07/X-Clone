import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

import { IoImageOutline, IoLocationOutline } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";

import Feed from "@/components/Feed";

import { useCurrentUser } from "@/hooks/user";

import { MdOutlineGif } from "react-icons/md";
import { RiCalendarScheduleLine, RiListRadio } from "react-icons/ri";
import { useCreateTweets, useGetAllTweets } from "@/hooks/tweets";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Feed/Layout/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/client/api";
import {
  getAllTweetsQuery,
  getSignedURLForTweetsQuery,
} from "@/graphql/query/tweets";
import axios from "axios";
import toast from "react-hot-toast";

interface HomeProps {
  tweets: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  const { tweets = props.tweets as Tweet[] } = useGetAllTweets();
  const { mutateAsync } = useCreateTweets();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;

      const { getSingnedURLForTweet } = await graphqlClient.request(
        getSignedURLForTweetsQuery,
        { imageName: file.name, imageType: file.type }
      );

      if (getSingnedURLForTweet) {
        toast.loading("File Uploading", { id: "3" });
        await axios.put(getSingnedURLForTweet, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        toast.success("File Uploaded", { id: "3" });

        const url = new URL(getSingnedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handleFn = handleInputChangeFile(input);

    input.addEventListener("change", handleFn);
    input.click();
  }, [handleInputChangeFile]);
  const handleCreateTweet = useCallback(async () => {
    await mutateAsync({
      content,
      imageURL,
    });
    setContent("");
    setImageURL("");
  }, [mutateAsync, content, imageURL]);

  return (
    <div>
      <TwitterLayout>
        <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600  transition-all cursor-pointer">
            <div className="grid grid-cols-12  ">
              <div className="col-span-6 w-full h-full flex justify-center items-center font-semibold  hover:bg-zinc-900 p-4 ">
                For you
              </div>
              <div className="col-span-6 w-full h-full hover:bg-zinc-900 flex justify-center items-center font-semibold p-4">
                <div>Following</div>
              </div>
            </div>
          </div>
        </div>
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
                {imageURL && (
                  <Image
                    src={imageURL}
                    alt="post-image"
                    width={300}
                    height={300}
                  />
                )}
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
                      className="hidden sm:block bg-[#1d9bf0] rounded-full px-5 py-2   font-semibold text-sm "
                    >
                      Post
                    </button>
                    <button
                      onClick={handleCreateTweet}
                      className="block sm:hidden bg-[#1d9bf0] rounded-full px-2 py-2   font-semibold text-sm "
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
      </TwitterLayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);

  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
