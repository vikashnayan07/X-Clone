import React from "react";
import Image from "next/image";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedProps {
  data: Tweet;
}
const Feed: React.FC<FeedProps> = (props) => {
  const { data } = props;
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-zinc-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          {data.author?.profileImageURL && (
            <Image
              className=" rounded-full"
              src={data.author?.profileImageURL}
              alt="user"
              height={50}
              width={50}
            />
          )}
        </div>

        <div className="col-span-11">
          <h5>
            <Link href={`/${data.author?.id}`}>
              {data.author?.firstName} {data.author?.lastName}
            </Link>
          </h5>
          <p>{data.content}</p>
          {data.imageURL && (
            <Image
              className="mt-3 rounded-sm  outline-blue-300 outline outline-2 outline-offset-2 ..."
              src={data.imageURL}
              alt="post-image"
              width={450}
              height={400}
            />
          )}
          <div className="flex justify-between mt-4 text-md items-center p-2 w-[90%]">
            <div>
              <LuMessageCircle />
            </div>
            <div>
              <AiOutlineRetweet />
            </div>
            <div>
              <FaRegHeart />
            </div>
            <div>
              <FiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Feed;
