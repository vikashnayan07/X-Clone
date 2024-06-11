import React from "react";
import Image from "next/image";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
const Feed: React.FC = () => {
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-zinc-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          <Image
            src="https://avatars.githubusercontent.com/u/115102517?v=4"
            alt="user"
            height={50}
            width={50}
          />
        </div>

        <div className="col-span-11">
          <h5>Vikash nayan</h5>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum,
            culpa ab vitae obcaecati saepe dolorem.
          </p>
          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
          <div>
          <LuMessageCircle />
          </div>
          <div>
          <AiOutlineRetweet />
          </div>
          <div>
          <FaRegHeart  />
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
